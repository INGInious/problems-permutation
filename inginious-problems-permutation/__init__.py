# -*- coding: utf-8 -*-
#
# This file is part of INGInious. See the LICENSE and the COPYRIGHTS files for
# more information about the licensing of this file.

import os
import web
import json

from copy import deepcopy
from random import shuffle
from docutils.core import publish_parts

from inginious.common.tasks_problems import BasicProblem
from inginious.frontend.task_problems import DisplayableBasicProblem

__version__ = "0.3.dev0"

PATH_TO_PLUGIN = os.path.abspath(os.path.dirname(__file__))


class StaticMockPage(object):
    # TODO: Replace by shared static middleware and let webserver serve the files
    def GET(self, path):
        if not os.path.abspath(PATH_TO_PLUGIN) in os.path.abspath(os.path.join(PATH_TO_PLUGIN, path)):
            raise web.notfound()

        try:
            with open(os.path.join(PATH_TO_PLUGIN, "static", path), 'rb') as file:
                return file.read()
        except:
            raise web.notfound()

    def POST(self, path):
        return self.GET(path)


class PermutationProblem(BasicProblem):
    """Display an input box and check that the content is correct"""

    def __init__(self, task, problemid, content, translations=None):
        BasicProblem.__init__(self, task, problemid, content, translations)
        self._correctOrder = str(content.get("correctOrder", ""))

    @classmethod
    def get_type(cls):
        return "permutation"

    def input_is_consistent(self, task_input, default_allowed_extension, default_max_size):
        return self.get_id() in task_input

    def input_type(self):
        return dict

    def check_answer(self, task_input, language):
        # By default, everything pass in the docker agent.
        # If answer is specified, can be assessed in MCQ-like environnment using check_answer
        return True, None, ["Unknown answer"], 0
        
        original_content = self.get_original_content()
        text = original_content['text']

        if len(text) == 0:
            return None, None, None, 0
        elif task_input[self.get_id()].strip() == self._answer:
            return True, None, ["correct answer"], 0
        else:
            return False, None, ["wrong answer"], 0

    @classmethod
    def parse_problem(self, problem_content):
        return BasicProblem.parse_problem(problem_content)

    @classmethod
    def get_text_fields(cls):
        textFields = BasicProblem.get_text_fields()

        textFields["text"] = True

        return textFields


class DisplayablePermutationProblem(PermutationProblem, DisplayableBasicProblem):
    """ A displayable match problem """

    def __init__(self, task, problemid, content, translations=None):
        PermutationProblem.__init__(self, task, problemid, content, translations)

    @classmethod
    def get_type_name(self, gettext):
        return gettext("permutation")

    @classmethod
    def get_renderer(cls, template_helper):
        """ Get the renderer for this class problem """
        return template_helper.get_custom_renderer(os.path.join(PATH_TO_PLUGIN, "templates"), False)

    def to_list(self, obj):
        l = []
        i = 0
        while str(i) in obj:
            l.append(obj[str(i)])
            i += 1
        return l

    def show_input(self, template_helper, language):
        """ Show PermutationProblem """
        original_content = self.to_list(deepcopy(self.get_original_content()))
        for table in original_content:
            table["text"] = self.to_list(table["text"])
            table["text_id"] = self.to_list(table["text_id"])

        table_count = 0
        tables_names = []
        tables_colors = []
        container_color = '#f9944a'
        rows = []
        if len(original_content[0]["text"]) > 0:
            table_count += 1
            container_color = original_content[0]["tableColor"]
            rows += list(zip(original_content[0]["text"], original_content[0]["text_id"]))

        for table in original_content[1:]:
            if len(table["text"]) > 0:
                table_count += 1
                tables_names.append(table["tableName"])
                tables_colors.append(table["tableColor"])
                rows += list(zip(table["text"], table["text_id"]))
        
        # Preprocess texts
        rows = [(publish_parts(text, writer_name='html')['html_body'], text_id) for (text, text_id) in rows]
        shuffle(rows)

        #Generating client data
        elems = [text for (text, _) in rows]
        elemsId = [text_id for (_, text_id) in rows]

        if table_count > 1:
            problem_subtype = 'trello'
        else:
            problem_subtype = 'list'

        return str(DisplayablePermutationProblem.get_renderer(template_helper).permutation(
                            self.get_id(), problem_subtype,
                            json.dumps(elems), json.dumps(elemsId),
                            json.dumps(list(zip(tables_names, tables_colors))), container_color))

    @classmethod
    def show_editbox(cls, template_helper, key):
        return DisplayablePermutationProblem.get_renderer(template_helper).permutation_edit(key)


def init(plugin_manager, course_factory, client, plugin_config):
    # TODO: Replace by shared static middleware and let webserver serve the files
    plugin_manager.add_page('/plugins/permutation/static/(.+)', StaticMockPage)
    
    # lib css
    plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/lib/markitup/skins/markitup/style.css")
    # plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/lib/markitup/sets/default/style.css")
    # Main css
    plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/permutation.css")

    # lib js
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/task/permutation_task.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/markitup/jquery.markitup.js")
    # plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/markitup/sets/default/set.js")
    
    # UI scripts (check webpack projects)
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/ui/permutation_task.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/ui/permutation_studio.js")

    # Main scripts
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/studio_permutation.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/task_permutation.js")
    course_factory.get_task_factory().add_problem_type(DisplayablePermutationProblem)

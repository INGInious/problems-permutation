# -*- coding: utf-8 -*-
#
# This file is part of INGInious. See the LICENSE and the COPYRIGHTS files for
# more information about the licensing of this file.

import os
import web
import json
import gettext

from copy import deepcopy
from random import shuffle
from docutils.core import publish_parts

from inginious.common.tasks_problems import Problem
from inginious.frontend.task_problems import DisplayableProblem
from inginious.frontend.parsable_text import ParsableText

__version__ = "0.3.dev1"

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


class PermutationProblem(Problem):
    """Display an input box and check that the content is correct"""

    def __init__(self, problemid, content, translations, taskfs):
        Problem.__init__(self, problemid, content, translations, taskfs)
        self._correctOrder = str(content.get("correctOrder", ""))
        self._header = content['header'] if "header" in content else ""

    @classmethod
    def get_type(cls):
        return "permutation"

    def input_is_consistent(self, task_input, default_allowed_extension, default_max_size):
        return self.get_id() in task_input

    def input_type(self):
        return dict

    def check_answer(self, task_input, language):
        # TODO
        # By default, everything pass in the docker agent.
        # If answer is specified, can be assessed in MCQ-like environnment using check_answer
        return True, None, ["Unknown answer"], 0, ""
        
        original_content = self.get_original_content()
        text = original_content['text']

        if len(text) == 0:
            return None, None, None, 0, ""
        elif task_input[self.get_id()].strip() == self._answer:
            return True, None, ["correct answer"], 0, ""
        else:
            return False, None, ["wrong answer"], 0, ""

    @classmethod
    def parse_problem(self, problem_content):
        return Problem.parse_problem(problem_content)

    @classmethod
    def get_text_fields(cls):
        textFields = Problem.get_text_fields()

        textFields["text"] = True

        return textFields


class DisplayablePermutationProblem(PermutationProblem, DisplayableProblem):
    """ A displayable match problem """

    def __init__(self, problemid, content, translations, taskfs):
        PermutationProblem.__init__(self, problemid, content, translations, taskfs)

    @classmethod
    def get_type_name(self, language):
        return "permutation"

    @classmethod
    def show_editbox_templates(cls, template_helper, key, language):
        return DisplayablePermutationProblem.get_renderer(template_helper).permutation_edit_templates(key)

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

    def parse_rst(self, s):
        parser = ParsableText(s)
        return str(parser)
    
    def show_input(self, template_helper, language, seed):
        """ Show PermutationProblem """
        # Parsing dictionaries to arrays
        header = ParsableText(self.gettext(language,self._header), "rst",
                              translation=self.get_translation_obj(language))
        original_content = self.to_list(deepcopy(self.get_original_content()))
        for table in original_content:
            # Some lists have no elements
            if "text" in table:
                table["text"] = self.to_list(table["text"])
            else:
                table["text"] = []
            if "text_id" in table:
                table["text_id"] = self.to_list(table["text_id"])
            else:
                table["text_id"] = []

        table_count = 0
        tables_names = []
        tables_colors = []
        rows = []

        for table in original_content:
            if len(table["text"]) > 0:
                table_count += 1
            tables_names.append(table["tableName"])
            tables_colors.append(table["tableColor"])
            rows += list(zip(table["text"], table["text_id"]))
        
        # Preprocess texts
        rows = [(self.parse_rst(text), text_id) for (text, text_id) in rows]
        shuffle(rows)

        #Generating client data
        elems = [text for (text, _) in rows]
        elemsId = [text_id for (_, text_id) in rows]

        if table_count > 1 or len(original_content) > 2:
            problem_subtype = 'trello'
        else:
            problem_subtype = 'list'

        return str(DisplayablePermutationProblem.get_renderer(template_helper).permutation(
                            self.get_id(), problem_subtype, header,
                            json.dumps(elems), json.dumps(elemsId),
                            json.dumps(list(zip(tables_names, tables_colors)))))

    @classmethod
    def show_editbox(cls, template_helper, key, language):
        return DisplayablePermutationProblem.get_renderer(template_helper).permutation_edit(key)


def init(plugin_manager, course_factory, client, plugin_config):
    # TODO: Replace by shared static middleware and let webserver serve the files
    plugin_manager.add_page('/plugins/permutation/static/(.+)', StaticMockPage)
    
    # lib css
    # plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/lib/markitup/skins/markitup/style.css")
    # plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/lib/markitup/sets/default/style.css")
    # Main css
    plugin_manager.add_hook("css", lambda: "/plugins/permutation/static/permutation.css")

    # lib js
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/hammer.min.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/web-animations.min.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/muuri.min.js")
    # plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/markitup/jquery.markitup.js")
    # plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/lib/markitup/sets/default/set.js")
    
    # UI scripts (check webpack projects)
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/ui/permutation_task.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/ui/permutation_studio.js")

    # Main scripts
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/studio_permutation.js")
    plugin_manager.add_hook("javascript_header", lambda: "/plugins/permutation/static/task_permutation.js")
    course_factory.get_task_factory().add_problem_type(DisplayablePermutationProblem)

var pp;

function studio_init_template_permutation(well, pid, problem) {
    // Detect tab change event
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") 
        
        // wait activation of tab 'subproblems'
        if(target == '#tab_subproblems') {
            var position = 2;
            pp = new PermutationProblem(pid, position);
            
            if (0 in problem['text']) pp.set_row(0, problem['text'][0], problem['textId'][0]);
            if (1 in problem['text']) pp.set_row(1, problem['text'][1], problem['textId'][1]);

            while(position in problem['text']) {
                pp.add_row();
                pp.set_row(position, problem['text'][position], problem['textId'][position]);
                
                position ++;
            }
            pp.add_listeners()
        }
    });
}

// Factory objects
const inputTextFactory = (pid, i) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-7')

    const inputText = document.createElement('input')
    inputText.setAttribute('id', 'text_' + pid + '_' + i)
    inputText.setAttribute('class', 'form-control input-md')
    inputText.setAttribute('name', 'problem[' + pid + '][text][' + i + ']')
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('placeholder', 'Insert text of the next element')
    tableRow.appendChild(inputText)
    
    return tableRow
}

const inputTextIdFactory = (pid, i) => {
    const tableRow = document.createElement('td')
    tableRow.setAttribute('class', 'col-md-2')
    
    const inputTextId = document.createElement('input')
    inputTextId.setAttribute('id', 'textId_' + pid + '_' + i)
    inputTextId.setAttribute('class', 'form-control input-md')
    inputTextId.setAttribute('name', 'problem[' + pid + '][textId][' + i + ']')
    inputTextId.setAttribute('type', 'text')
    inputTextId.setAttribute('placeholder', 'Id')
    tableRow.appendChild(inputTextId)
    
    return tableRow
}

// Main class
function PermutationProblem(pid, position) {
    this.pid = pid;
    
    this._idList = [];
    this._position = position;

    // Add empty strings for first ids
    for(let i=0;i<position;i++) this._idList.push('');

    this.generateId = function(value, position) {
        var simpler = value.replace(/\s+/g, '');
        if(simpler.length==0) {
            var loop = true;
            while(loop) {
                simpler = Math.floor(Math.random() * 1000);
                idx = this._idList.indexOf(simpler);
                loop = idx>-1 && idx!=position;
            }
        } else if(simpler.length > 5) {
            simpler = simpler.substring(0, 9);
            
            var counter = 0;

            var loop = true;
            while(loop) {
                var genId = simpler;
                if(counter > 0) genId += '-' + counter;

                counter ++;

                idx = this._idList.indexOf(genId);
                loop = idx>-1 && idx!=position;
            }
            counter --;

            if(counter > 0) simpler += '-' + counter;
        }

        return simpler;
    }
}

PermutationProblem.prototype.add_listeners = function() {
    var that = this;

    $("#add_row_" + this.pid).click(() => {
        that.add_row(this.pid, this._position);
    });
    $('#delete_row_' + this.pid).click(function(){
        that.remove_row();
    });

    for(let i=0;i<this._position;i++) {
        $('#text_' + this.pid + '_' + i).on("change paste keyup", function() {
            return; 
            // Do this only if id autogeneration wanted
            var value = $(this).val();
            var newValue = that.generateId(value, i);

            that._idList[i] = newValue;
            $('#textId_' + that.pid + '_' + i).val(newValue);
        });
    }
}

PermutationProblem.prototype.add_row = function() {
    $('#addr_' + this.pid + '_' + this._position).html('')    
    $('#addr_' + this.pid + '_' + this._position).append('<td class="col-md-1" style="text-align: center;vertical-align: middle;">'+ (this._position+1) + '</td>')
    $('#addr_' + this.pid + '_' + this._position).append(inputTextFactory(this.pid, this._position))
    $('#addr_' + this.pid + '_' + this._position).append(inputTextIdFactory(this.pid, this._position))

    $('#tab_logic_' + this.pid).append('<tr id="addr_' + this.pid + '_' + (this._position+1) + '"></tr>');
    
    // Ids generation
    var that = this;
    var pos = this._position;

    this._idList.push('');
    $('#text_' + this.pid + '_' + this._position).on("change paste keyup", function() {
        return; 
        // Do this only if id autogeneration wanted
        var value = $(this).val();
        var newValue = that.generateId(value, pos);

        that._idList[pos] = newValue;
        $('#textId_' + that.pid + '_' + pos).val(newValue);
    });

    this._position++;
}

PermutationProblem.prototype.remove_row = function() {
    if(this._position > 2){
        $('#addr_' + this.pid + '_' + (this._position-1)).off();
        $('#addr_' + this.pid + '_' + (this._position-1)).html('');
        this._idList.pop();
        this._position--;
    }
}

PermutationProblem.prototype.set_row = function(position, value, valueId) {
    $('#text_' + this.pid + '_' + position).val(value);
    $('#textId_' + this.pid + '_' + position).val(valueId);
}
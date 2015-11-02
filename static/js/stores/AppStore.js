/**
 * Created by erfan on 9/7/15.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
//var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _isFreeze = false;
var _rows = [];
var _colNames = [];
var _show = [];
var _isLoading = 0;
/**
 * Split a part.
 * @param {id} id of parent part
 * @param {isHorizontal} is dividing horizontal
 * @param {isUp} in case of horizontal: is new part up, vertical: right
 */
function load() {
    $.ajax({
        url: 'static/data.json',
        type: 'get',
        success: function(data) {
            var new_rows = data["rows"];
            _colNames = data["colNames"];
            _show = data["show"];
            _isFreeze = data["isFreeze"];
            if(_isFreeze){
                AppStore.emitChange();
            } else {
                if (_rows.length == 0) {
                    _rows = data["rows"];
                }
                else {
                    for (var i = 0; i < new_rows.length; i++) {
                        var andis = -1;
                        for (var j = 0; j < _rows.length; j++) {
                            if (new_rows[i]["id"] == _rows[j]["id"]) {
                                andis = j;
                            }
                        }
                        if (andis === -1)
                            continue;
                        for (var j = 0; j < new_rows[i]["rounds"].length; j++) {
                            _rows[andis]["rounds"][j] = new_rows[i]["rounds"][j];
                        }
                    }
                }
                for (var i = 0; i < _rows.length; i++) {
                    var sum = 0;
                    for (var j = 0; j < _rows[i]["rounds"].length; j++) {
                        sum += parseFloat(_rows[i]["rounds"][j]);
                    }
                    _rows[i]["total"] = sum;
                }
                var i = 0;
                var sortInterval = setInterval(function () {
                    var swapped = false;
                    for (var j = 0; j < _rows.length - i - 1; j++) {
                        if (parseFloat(_rows[j]['total']) < parseFloat(_rows[j + 1]['total'])) {
                            swapped = true;
                            var tmp = _rows[j];
                            _rows[j] = _rows[j + 1];
                            _rows[j + 1] = tmp;
                        }
                    }
                    i++;
                    if (i == _rows.length || !swapped) {
                        _isLoading = 0;
                        clearInterval(sortInterval);
                    } else {
                        _isLoading = 1;
                    }
                    AppStore.emitChange();
                }, 1000);
            }
        }
    })
}

var AppStore = assign({}, EventEmitter.prototype, {
  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function() {
    return {
        rows: _rows,
        show: _show,
        colNames: _colNames,
        isLoading: _isLoading,
        isFreeze: _isFreeze
    };
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var id = action.id;

    switch(action.actionType) {
        case "load":
            load();
            break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = AppStore;

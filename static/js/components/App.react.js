var React = require('react');
var Row = require('./Row.react');
var AppStore = require('../stores/AppStore');
var AppActions = require('../actions/AppActions');

function getAppState() {
    return {
        allRows: AppStore.getAll()["rows"],
        showing: AppStore.getAll()["show"],
        colNames: AppStore.getAll()["colNames"],
        isLoading: AppStore.getAll()["isLoading"],
        isFreeze: AppStore.getAll()["isFreeze"]
    };
}

var App = React.createClass({

    getInitialState: function () {
        return getAppState();
    },

    componentDidMount: function () {
        AppStore.addChangeListener(this._onChange);
        AppActions.load();
        setInterval(function() {
            AppActions.load();
        }, 1000);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },

    /**
     * @return {object}
     */
    render: function () {
        var isFreeze = this.state.isFreeze;
        var allRows = this.state.allRows;
        var colNames = this.state.colNames;
        var isLoading = this.state.isLoading;
        var showing = this.state.showing;

        var rows = [];
        for (var key in allRows) {
            rows.push(<Row myKey={key} rowData={allRows[key]} isLoading={isLoading} showing={showing}/>);
        }

        var headingRow = [];
        if(allRows.length > 0){
            var count = 0;
            for (var key in colNames){
                headingRow[count] = (<th>{colNames[key]}</th>);
                count ++;
            }
        }
        var style = (!isFreeze ? {'direction': 'rtl'} : {'direction': 'rtl', 'backgroundImage': 'url(static/img/ice-2.gif)', 'repeatX': true});

        return (
            <div className="App row" style={style}>
                <div className="col offset-l1 l10 offset-m2 m8 white" onClick={this.onClick}>
                    <table className="">
                        <thead>
                            <tr>
                            {headingRow}
                            </tr>
                        </thead>
                        <tbody>
            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
            );
    },

    onClick: function () {
        AppActions.load();
    },
    _onChange: function () {
        this.setState(getAppState());
    }

});

module.exports = App;

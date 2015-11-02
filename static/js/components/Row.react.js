/**
 * Created by erfan on 9/8/15.
 */

var React = require('react');
var AppActions = require('../actions/AppActions');

var Row = React.createClass({

    propTypes: {
        rowData: React.PropTypes.object.isRequired,
        myKey: React.PropTypes.number.isRequired
    },

    render: function () {
        var rowData = this.props.rowData;
        var isLoading = this.props.isLoading;
        var show = this.props.showing;

        var count = 1;
        var data = [];

        /*
                    <div className="preloader-wrapper small active">
                        <div className="spinner-layer spinner-blue-only">
                          <div className="circle-clipper">
                            <div className="circle"></div>
                          </div>
                        </div>
                    </div>
        */
        if(isLoading){
            data[0] = (
                <td style={{'position': 'relative'}}>
                    X
                </td>
            );
        } else {
            data[0] = (<td><h6>{parseInt(this.props.myKey) + 1}</h6></td>);
        }
        for (key in show){
            data[count] = (<td><h4>{rowData[show[key]]}</h4></td>);
            count++;
        }
        var sum = 0;
        for (var i = 0 ; i < rowData["rounds"].length ; i++){
            data[count] = (<td><h4>{rowData["rounds"][i]}</h4></td>);
            sum += parseFloat(rowData["rounds"][i]);
            count++;
        }

        sum = Number((sum).toFixed(2));
        data[count] = (<td><h4>{sum}</h4></td>);
        count++;

        return (
            <tr className={'table-row lighten-2 ' + rowData['color']} key={this.props.key}>
            {data}
            </tr>
            );
    },

    _onClick: function () {
        AppActions.split(this.props.key);
    }

});

module.exports = Row;

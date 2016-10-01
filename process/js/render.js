var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadApts = JSON.parse(fs.readFileSync(dataLocation));

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var AptList = require('./AptList');
var Toolbar = require('./Toolbar');
var AddAppointment = require('./AddAppointment');

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      aptBodyVisible: false,
      myAppointments: loadApts
    }//return
  }, //getInitialState

  componentDidUpdate: function() {
    fs.writeFile(dataLocation, JSON.stringify(this.state.myAppointments), 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
    });//writeFile
  }, //componentDidUpdate

  toggleAptDisplay: function() {
    var tempVisibility = !this.state.aptBodyVisible;
    this.setState({
      aptBodyVisible: tempVisibility
    }); //setState
  }, //toggleAptDisplay

  showAbout:function() {
    ipc.sendSync('openInfoWindow');
  }, //showAbout

  addItem: function(tempItem) {
    var tempApts = this.state.myAppointments;
    tempApts.push(tempItem);
    this.setState({
      myAppointments: tempApts,
      aptBodyVisible: false
    }) //setState
  }, //addItem

  deleteMessage: function(item) {
    var allApts = this.state.myAppointments;
    var newApts = _.without(allApts, item);
    this.setState({
      myAppointments: newApts
    }); //setState
  }, //deleteMessage

  render: function() {
    var myAppointments = this.state.myAppointments;

    if(this.state.aptBodyVisible === true) {
      $('#addAppointment').modal('show');
    } else {
      $('#addAppointment').modal('hide');
    }

    myAppointments=myAppointments.map(function(item, index) {
      return(
        <AptList key = {index}
          singleItem = {item}
          whichItem =  {item}
          onDelete = {this.deleteMessage}
        />
      ) // return
    }.bind(this)); //Appointments.map
    return(
      <div className="application">
        <div className="interface">
          <Toolbar
            handleToggle = {this.toggleAptDisplay}
            handleAbout = {this.showAbout}
          />
          <AddAppointment
            handleToggle = {this.toggleAptDisplay}
            addApt = {this.addItem}
          />
          <div className="container">
           <div className="row">
             <div className="appointments col-sm-12">
               <h2 className="appointments-headline">Current Appointments</h2>
               <ul className="item-list media-list">{myAppointments}</ul>
             </div>{/* col-sm-12 */}
           </div>{/* row */}
          </div>{/* container */}
        </div>{/* interface */}
      </div>
    );
  } //render
});//MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render

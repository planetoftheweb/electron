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
var HeaderNav = require('./HeaderNav');
var AddAppointment = require('./AddAppointment');

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      aptBodyVisible: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
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

  reOrder: function(orderBy, orderDir) {
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    }) //setState
  }, //reOrder

  searchApts: function(query) {
    this.setState({
      queryText: query
    }); //setState
  }, //searchApts

  render: function() {
    var filteredApts = [];
    var queryText = this.state.queryText;
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var myAppointments = this.state.myAppointments;

    if(this.state.aptBodyVisible === true) {
      $('#addAppointment').modal('show');
    } else {
      $('#addAppointment').modal('hide');
    }

    for (var i = 0; i < myAppointments.length; i++) {
      if (
        (myAppointments[i].petName.toLowerCase().indexOf(queryText)!=-1) ||
        (myAppointments[i].ownerName.toLowerCase().indexOf(queryText)!=-1) ||
        (myAppointments[i].aptDate.toLowerCase().indexOf(queryText)!=-1) ||
        (myAppointments[i].aptNotes.toLowerCase().indexOf(queryText)!=-1)
      ) {
        filteredApts.push(myAppointments[i]);
      }
    }

    filteredApts = _.orderBy(filteredApts, function(item) {
      return item[orderBy].toLowerCase();
    }, orderDir); // order array

    filteredApts=filteredApts.map(function(item, index) {
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
        <HeaderNav
          orderBy = {this.state.orderBy}
          orderDir =  {this.state.orderDir}
          onReOrder = {this.reOrder}
          onSearch= {this.searchApts}
        />
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
               <ul className="item-list media-list">{filteredApts}</ul>
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

var React = require('react');
var ReactDOM = require('react-dom');
var electron = eRequire('electron');
var ipc = electron.ipcRenderer;


var fs = eRequire('fs');
var _ = require('lodash');
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

var HeaderNav = require('./HeaderNav');
var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var Toolbar = require('./Toolbar');
var loadApts = JSON.parse(fs.readFileSync(dataLocation));

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      aptBodyVisible: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      myAppointments: loadApts
    } //return
  }, //getInitialState

  componentDidMount: function() {
    // window.addEventListener('ping', this.toggleAddDisplay());
    ipc.on('toggleAddEvent', function(event, message) {
      this.toggleAddDisplay()
    }.bind(this));
  },

  componentWillUnmount: function() {
    ipc.removeListener('toggleAddEvent', function(event, message) {
      this.toggleAddDisplay()
    }.bind(this));
  },

  componentDidUpdate: function() {
   fs.writeFile(dataLocation, JSON.stringify(this.state.myAppointments), 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
    });
  }, //componentWillUpdate

  deleteMessage: function(item) {
    var allApts = this.state.myAppointments;
    var newApts = _.without(allApts, item);
    this.setState({
      myAppointments: newApts
    }); //setState
  }, //deleteMessage

  toggleAddDisplay: function() {
    var tempVisibility = !this.state.aptBodyVisible;
    this.setState({
      aptBodyVisible: tempVisibility
    }); //setState
  }, //toggleAddDisplay

  showAbout: function() {
    ipc.sendSync('openInfoWindow')
  },

  addItem: function(tempItem) {
    var tempApts = this.state.myAppointments;
    tempApts.push(tempItem);
    this.setState({
      myAppointments: tempApts,
      aptBodyVisible: false
    }); //setState
  }, //addItem

  reOrder: function(orderBy, orderDir) {
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    }); //setState
  }, //reOrder

  searchApts(query) {
    this.setState({
      queryText: query
    }); //setState
  }, //searchApts

  render: function() {
    var filteredApts = [];
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var queryText = this.state.queryText;
    var myAppointments = this.state.myAppointments;

    if (this.state.aptBodyVisible === true) {
      $('#addAppointment').modal('show');
    } else {
      $('#addAppointment').modal('hide');
    }

    for (var i = 0; i < myAppointments.length; i++) {
      myAppointments[i]
      if(
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
    }, orderDir);//orderBy

    filteredApts = filteredApts.map(function(item, index) {
      return(
        <AptList key = { index }
          singleItem = { item }
          whichItem = { item }
          onDelete = { this.deleteMessage } />
      ) //return
    }.bind(this)); //filteredApts.map
    return (
      <div className="application">
        <HeaderNav
          orderBy = { this.state.orderBy }
          orderDir = { this.state.orderDir }
          onReOrder = { this.reOrder }
          onSearch = { this.searchApts }
        />
        <div className="interface">
          <Toolbar
            handleToggle = { this.toggleAddDisplay }
            handleAbout = { this.showAbout }
          />
          <AddAppointment
            bodyVisible = { this.state.aptBodyVisible }
            handleToggle = { this.toggleAddDisplay }
            addApt = { this.addItem } />
            <div className="container">
            <div className="row">
              <div className="appointments col-sm-12">
                <h2 className="appointments-headline">Current Appointments</h2>
                <ul className="item-list media-list">{filteredApts}</ul>
              </div>{/* col-sm-12 */}
            </div>{/* row */}
          </div>{/* Interface */}
        </div>{/* Item List Container */}
      </div>
    ) //return
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render

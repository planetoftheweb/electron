var React = require('react');
var ReactDOM = require('react-dom');

var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var fs = eRequire('fs');
var loadApts = JSON.parse(fs.readFileSync(dataLocation));

var MainInterface = React.createClass({
  getInitialState: function() {
    return {
      myAppointments: loadApts
    }//return
  }, //getInitialState
  render: function() {
    var myAppointments = this.state.myAppointments;
    return(

      <div className="application">
        <div className="container">
         <div className="row">
           <div className="appointments col-sm-12">
             <h2 className="appointments-headline">Current Appointments</h2>
             <ul className="item-list media-list">

               <li className="pet-item media">
                 <div className="pet-info media-body">
                   <div className="pet-head">
                     <span className="pet-name">{myAppointments[0].petName}</span>
                     <span className="apt-date pull-right">{myAppointments[0].aptDate}</span>
                   </div>
                   <div className="owner-name"><span className="label-item">Owner:</span>
                   {myAppointments[0].ownerName}</div>
                   <div className="apt-notes">{myAppointments[0].aptNotes}</div>
                 </div>
               </li>

             </ul>
           </div>{/* col-sm-12 */}
         </div>{/* row */}
        </div>{/* container */}
      </div>

    );
  } //render
});//MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('petAppointments')
); //render

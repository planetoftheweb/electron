var React = require('react');

var AddAppointment = React.createClass({

  toggleAptDisplay: function() {
    this.props.handleToggle();
  },

  handleAdd: function(e) {
    e.preventDefault();
    var tempItem = {
      petName: this.inputPetName.value,
      ownerName: this.inputPetOwner.value,
      aptDate: this.inputAptDate.value + ' ' + this.inputAptTime.value,
      aptNotes: this.inputAptNotes.value,
    } //tempitems

    this.props.addApt(tempItem);
  }, //handleAdd

  render: function() {
    return(
      <div className="modal fade" id="addAppointment" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.toggleAptDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add an Appointment</h4>
            </div>

            <form className="modal-body add-appointment form-horizontal" onSubmit={this.handleAdd}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="petName">Pet Name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="petName" ref={(ref) => this.inputPetName = ref } placeholder="Pet's Name" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="petOwner">Pet Owner</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="petOwner"  ref={(ref) => this.inputPetOwner = ref } placeholder="Owner's Name" />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="aptDate">Date</label>
                <div className="col-sm-9">
                  <input type="date" className="form-control"
                    id="aptDate"  ref={(ref) => this.inputAptDate = ref } />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="aptTime">Time</label>
                <div className="col-sm-9">
                  <input type="time" className="form-control"
                    id="aptTime"  ref={(ref) => this.inputAptTime = ref } />
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="aptNotes">Apt. Notes</label>
                <div className="col-sm-9">
                  <textarea className="form-control" rows="4" cols="50"
                    id="aptNotes"  ref={(ref) => this.inputAptNotes = ref } placeholder="Appointment Notes"></textarea>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="pull-right">
                    <button type="button" className="btn btn-default"  onClick={this.toggleAptDisplay}>Cancel</button>&nbsp;
                    <button type="submit" className="btn btn-primary">Add Appointment</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) //return
  } //render
}); //AddAppointment

module.exports=AddAppointment;

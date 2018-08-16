import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convertDateToValue } from '../../lib/utils';
import PointTrackerTable from '../point-tracker-table/point-tracker-table';
import * as pointTrackerActions from '../../actions/point-tracker';
import './point-tracker-form.scss';

const defaultState = {
  _id: '1EF12348902093DECBA908',
  date: 1533761272724,
  studentId: '1EF12348902093DECBA908',
  subjects: [{
    subjectName: 'Social Studies',
    teacher: '1EF12348902093DECBA910',
    scoring: {
      excusedDays: 1,
      stamps: 14,
      halfStamps: 3,
      tutorials: 1,
    },
    grade: 90,
  }, {
    subjectName: 'Math',
    teacher: '1EF12348902093DECBA912',
    scoring: {
      excusedDays: 1,
      stamps: 12,
      halfStamps: 6,
      tutorials: 0,
    },
    grade: 70,
  }, {
    subjectName: 'Biology',
    teacher: '1EF12348902093DECBA914',
    scoring: {
      excusedDays: 1,
      stamps: 16,
      halfStamps: 1,
      tutorials: 2,
    },
    grade: 50,
  }],
  surveyQuestions: {
    attendedCheckin: true,
    metFaceToFace: true,
    hadOtherCommunication: false,
    scoreSheetTurnedIn: true,
    scoreSheetLostOrIncomplete: true,
    scoreSheetWillBeLate: true,
    scoreSheetOther: true,
  },
  synopsisComments: {
    extraPlayingTime: 'Jamie is working hard toward his goals. We agreed that if he achieved a small improvement this week he would get extra playing time.',
    mentorGrantedPlayingTime: 'Three Quarters',
    studentActionItems: 'Jamie agreed to attend 1 more tutorial in each of his classes this coming week',
    sportsUpdate: 'Last week Jamie had a great game against the Cardinals. Had two hits and caught three fly balls!',
    additionalComments: '',
  },
};

const mapDispatchToProps = dispatch => ({
  createPointTracker: pointTracker => dispatch(pointTrackerActions.createPointTracker(pointTracker)),
  fetchStudents: studentIds => dispatch(pointTrackerActions.fetchStudents(studentIds)),
  fetchLastPointTracker: studentId => dispatch(pointTrackerActions.fetchLastPointTracker(studentId)),
  fetchTeachers: studentId => dispatch(pointTrackerActions.fetchTeachers(studentId)),
});

class PointTrackerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      teachers: [],
      pointTracker: defaultState,
    };
  }

  calcPlayingTime = () => {
    const { subjects } = this.state.pointTracker;
    console.log(subjects, 'SUBJECTS');

    const totalClassScores = subjects.map((subject) => {
      const { grade, subjectName } = subject;
      const { excusedDays, stamps, halfStamps } = subject.scoring;

      const pointsEarned = 2 * stamps + halfStamps;
      const pointsPossible = subjectName === 'Tutorial' ? 10 - excusedDays * 2 : 40 - excusedDays * 8;
      const pointPercentage = pointsEarned / pointsPossible;
      
      let pointScore = 0;
      if (pointPercentage >= 0.50) pointScore = 1;
      if (pointPercentage >= 0.75) pointScore = 2;

      let gradeScore = 0;
      if (grade >= 0.6) gradeScore = 1;
      if (grade >= 0.7) gradeScore = 2;
      if (subjectName === 'Tutorial') gradeScore = 0;

      const totalClassScore = pointScore + gradeScore;

      return totalClassScore;
    });
    
    const totalClassScoreSum = totalClassScores.reduce((acc, cur) => acc + cur, 0);

    console.log(totalClassScores, 'TOTAL CLASS SCORES');
    if (totalClassScoreSum >= 30) return 'Entire game';
    if (totalClassScoreSum >= 29) return 'All but start';
    if (totalClassScoreSum >= 25) return 'Three quarters';
    if (totalClassScoreSum >= 21) return 'Two quarters';
    if (totalClassScoreSum >= 29) return 'One quarter';
    return 'None of game';
  }

  handleDateChange = (event) => {
    const { value } = event.target;
    const [year, month, day] = value.split('-');
    const date = new Date(
      parseInt(year, 10), 
      parseInt(month, 10) - 1, 
      parseInt(day, 10),
    );

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.date = date.getTime();
      return newState;
    });
  }

  handleSubjectChange = (event) => {
    const { name, value } = event.target;
    
    this.setState((prevState) => {
      const newState = { ...prevState };
      const [subjectName, categoryName] = name.split('-');
      
      const newSubjects = newState.pointTracker.subjects
        .map((subject) => {
          if (subject.subjectName === subjectName) {
            const newSubject = { ...subject };

            if (categoryName === 'grade') {
              newSubject.grade = value;
            } else {
              newSubject.scoring[categoryName] = value;
            }
            
            return newSubject;
          }

          return subject;
        });

      newState.pointTracker.subjects = newSubjects;
      return newState;
    });
  }

  handleSurveyQuestionChange = (event) => {
    const { name, checked } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.surveyQuestions[name] = checked;
      return newState;
    });
  }

  handleSynopsisCommentChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => {
      const newState = { ...prevState };
      newState.pointTracker.synopsisComments[name] = value;
      return newState;
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.createPointTracker(this.state.pointTracker);
  }

  componentDidMount() {
    this.props.fetchStudents()
      .then((students) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          newState.student = students || [];
          
          return newState;
        });
      })
      .catch(console.error); // eslint-disable-line
  }

  handleStudentSelect = (event) => {
    event.preventDefault();
    const studentId = event.target.value;
    
    this.props.fetchTeachers(studentId)
      .then((teachers) => {
        this.setState((prevState) => {
          const newState = { ...prevState };
          
          newState.teachers = teachers || [];
          newState.pointTracker.studentId = studentId;
    
          return newState;
        });
      });
  }

  render() {
    const selectOptionsJSX = (
      <React.Fragment>
        <label htmlFor="">Select Student</label>
        <select onChange={ this.handleStudentSelect } >
          { this.state.students.map((student) => {
            const { _id, firstName, lastName } = student;
            return (
              <option 
                placeholder="Select" 
                key={ _id } 
                value={ _id }
              >{ `${firstName} ${lastName}`}
              </option>
            );
          })}
        </select>
        <label htmlFor="">Select Date</label>
        <input
          name="date"
          type="date"
          onChange={ this.handleDateChange }
          value={ convertDateToValue(this.state.pointTracker.date) }
        />
      </React.Fragment>
    );
    
    const surveyQuestionsJSX = (
      <fieldset>
      <label htmlFor="attendedCheckin">Attended Check-In</label>
      <input
        type="checkbox"
        name="attendedCheckin"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.attendedCheckin }
      />

      <label htmlFor="metFaceToFace">Met Face-to-Face</label>
      <input
        type="checkbox"
        name="metFaceToFace"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.metFaceToFace }
      />

      <label htmlFor="hadOtherCommunication">Had Other Communication</label>
      <input
        type="checkbox"
        name="hadOtherCommunication"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.hadOtherCommunication }
      />

      <label htmlFor="scoreSheetTurnedIn">Score Sheet Turned In</label>
      <input
        type="checkbox"
        name="scoreSheetTurnedIn"
        onChange= { this.handleSurveyQuestionChange }
        checked={ this.state.pointTracker.surveyQuestions.scoreSheetTurnedIn }
      />
    </fieldset>
    );
    
    const synopsisCommentsJSX = (
      <div className="synopsis">
      <h4>Synopsis</h4>

      <label htmlFor="extraPlayingTime">Extra Playing Time</label>
      <textarea
        name="extraPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.extraPlayingTime }
      />

      <p>Recommended playing time: { this.calcPlayingTime() }</p>
      <label htmlFor="mentorGrantedPlayingTime">Playing Time Earned</label>
      <select
        name="mentorGrantedPlayingTime"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.mentorGrantedPlayingTime }
        >
        <option value="" disabled defaultValue>Select Playing Time</option>
        <option value="Entire Game">Entire Game</option>
        <option value="All but start">All but start</option>
        <option value="Three quarters">Three quarters</option>
        <option value="Two quarters">Two quarters</option>
        <option value="One quarter">One quarter</option>
        <option value="None of game">None of game</option>
      </select>

      <label htmlFor="studentActionItems">Student Action Items</label>
      <textarea
        name="studentActionItems"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.studentActionItems }
      />

      <label htmlFor="sportsUpdate">Sports Update</label>
      <textarea
        name="sportsUpdate"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.sportsUpdate }
        />

      <label htmlFor="additionalComments">Additional Comments</label>
      <textarea
        name="additionalComments"
        onChange={ this.handleSynopsisCommentChange }
        value={ this.state.pointTracker.synopsisComments.additionalComments }
      />
    </div>
    );

    return (
      <div className="points-tracker">
        <React.Fragment>
          <form className="data-entry" onSubmit={ this.handleSubmit }>
            <h1>POINT TRACKER TABLE</h1>
              <h4>Point Sheet and Grades</h4>
              { selectOptionsJSX }
              { surveyQuestionsJSX }
                <PointTrackerTable
                  handleSubjectChange={ this.handleSubjectChange }
                  subjects={ this.state.pointTracker.subjects }
              />
              { synopsisCommentsJSX }
            <button type="submit">Submit Point Tracker</button>
          </form>
        </React.Fragment>
      </div>
    );
  }
}

PointTrackerForm.propTypes = {
  handleChange: PropTypes.func,
  createPointTracker: PropTypes.func,
  fetchStudents: PropTypes.func,
  fetchLastPointTracker: PropTypes.func,
  fetchTeachers: PropTypes.func,
};

export default connect(null, mapDispatchToProps)(PointTrackerForm);

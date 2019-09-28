import React from 'react';
import 'rbx/index.css';
import { Button } from 'rbx';
import { db } from '../../App';
import {hasConflict} from './time';

export const buttonColor = selected => (
  selected ? 'success':null
  );

const Course = ({ course, state }) => (
<Button color={ buttonColor(state.selected.includes(course)) }
    onClick={ () => state.toggle(course) }
    onDoubleClick={ () => moveCourse(course) }
    disabled={ hasConflict(course, state.selected) }
    >
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);

export const days = ['M', 'Tu', 'W', 'Th', 'F'];

export const terms = {F:"Fall", W:"Winter", S:"Spring"};



const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;



export const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};


export const getCourseTerm = course => (
  terms[course.id.charAt(0)]
  );

const getCourseNumber = course => (
  course.id.slice(1,4)
  );



export default Course;
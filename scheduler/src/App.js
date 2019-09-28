import 'rbx/index.css';
import { Button, Container, Message, Title } from 'rbx';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList from './components/CourseList';
import {timeParts} from './components/Course/Course';


const firebaseConfig = {
  apiKey: "AIzaSyBoCvOIMaavDrpnyfSG5oC0EIwwq26yc6w",
  authDomain: "quickreact-9ee49.firebaseapp.com",
  databaseURL: "https://quickreact-9ee49.firebaseio.com",
  projectId: "quickreact-9ee49",
  storageBucket: "quickreact-9ee49.appspot.com",
  messagingSenderId: "695130637422",
  appId: "1:695130637422:web:7ffd3349a7ee951eb4d27f"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick = {()=>firebase.auth().signOut()}>
      Log out
      </Button>
    </Message.Header>
  </Message> 
);

const SignIn = ()=> (
  <StyledFirebaseAuth 
  uiConfig={uiConfig}
  firebaseAuth = {firebase.auth()}
  />
  );

const Banner = ({user, title}) => (
  <React.Fragment>
    {user ? <Welcome user={user} /> : <SignIn />}
  <Title>{ title || '[loading...]'}</Title>
  </React.Fragment>
  );
const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});
const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});




const App = () => {
  const [user, setUser] = useState(null);
  const [schedule, setSchedule] = useState({ title: '', courses: [] });

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);  
  }, []); 

  return (
    <Container>
      <Banner title={ schedule.title } user={user}/>
      <CourseList courses={ schedule.courses } user={user} />
    </Container>
);
};

export default App;

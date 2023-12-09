import React from 'react';
import Login from './login';
import Register from './register';
import Forget from './forget';

const authContent: React.FC = () => {
  const [current, setCurrent] = React.useState('login');
  switch (current) {
    case 'register':
      return <Register to={(flag) => setCurrent(flag)} />;
    case 'forget':
      return <Forget to={(flag) => setCurrent(flag)} />;
    default:
      return <Login to={(flag) => setCurrent(flag)} />;
  }
};
export default authContent;

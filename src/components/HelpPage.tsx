import React from 'react';
import { Link } from 'react-router-dom';
import {
  Modal,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button
} from 'reactstrap';


export default class HelpPage extends React.Component {

  render() {
    return (
      <>
        
              <div style={{margin: 'auto', marginLeft: 100}}>
                <iframe width="960" height="700" 
                  src="https://www.youtube.com/embed/PwSO7l-iRLQ">
                </iframe>
              </div>
            <Link to="/USAC-budget">
              <Button>
                Bye!
              </Button>
            </Link>
            
      </>
    );
  }
}

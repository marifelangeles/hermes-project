import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App/App.css';
// import LogOutButton from '../LogOutButton/LogOutButton';
import './ConnectPage.css';
import Grid from '@material-ui/core/Grid';

class ConnectPage extends Component {
     
    handleStartPostButton = (event) => {
        console.log('handleStartPostButton hit');
        // direct to next step: Select Platform
        event.preventDefault();
        this.props.history.push('/platforms');
        this.props.dispatch({ type: "STEP_ONE" })
    }
    componentDidMount() {
        this.props.dispatch({ type: 'CHECK_TOKEN' })
    }

    // this function is too make a hardcoded conditional rendering work for our demo we should get rid of this after presentation

    render() {
        let wordpressRedirectUrl = 'http://localhost:5000/wordpress/callback_wordpress`'
        let wordpressClientId = '65413'
        let podbeanRedirectUrl = 'https://hermes-group-marifel.herokuapp.com/podbean/callback_podbean'
        let podbeanClientID = '55ceb02de1d1d7efa69c1'
        return (
            <>
                <Grid
                    container
                    alignItems="left"
                    direction="center"
                    spacing={24}

                >
                    <Grid item sm={12}>
                        <Grid
                            container
                            alignItems="center"
                            direction="column"
                            spacing={24}
                        >
                            <Grid item sm={12}
                                onClick={this.handlePodBeanClick}
                            >
                            {this.props.reduxState.podbean.podbean_token ? 
                            
                             <div className="connected">
                             CONNECTED
                             <a href={`https://api.podbean.com/v1/dialog/oauth?redirect_uri=${podbeanRedirectUrl}&scope=episode_publish&response_type=code&client_id=${podbeanClientID}`}>
                                        
                             <div className="image-div">
                             <img className="icons" src="images/logo/podbean.png" alt="podbean_link" />
                                        </div>
                                    </a>
                                    </div>                                    
                                :
                                <div className="connect">
                             CONNECT TO
                             <a href={`https://api.podbean.com/v1/dialog/oauth?redirect_uri=${podbeanRedirectUrl}&scope=episode_publish&response_type=code&client_id=${podbeanClientID}`}>
                                        
                             <div className="image-div">
                             <img className="icons" src="images/logo/podbean.png" alt="podbean_link" />
                                        </div>
                                    </a>
                                </div>
                        }
                            </Grid>
                            <Grid item sm={12}
                                onClick={this.handleWordPressClick}
                            >
                            {this.props.reduxState.wordpress.wordpress_token ?
                            <div className="connected">
                            CONNECTED
                                <a href={`https://public-api.wordpress.com/oauth2/authorize?client_id=${wordpressClientId}&response_type=code&redirect_uri=${wordpressRedirectUrl}`}>
                                        <div className="image-div">
                                            <img className="icons" src="images/logo/WordPress.png" alt="wordpress_link" />
                                        </div>
                                    </a>
                                </div>
                                :
                                <div className="connect">
                            CONNECT TO
                                <a href={`https://public-api.wordpress.com/oauth2/authorize?client_id=${wordpressClientId}&response_type=code&redirect_uri=${wordpressRedirectUrl}`}>
                                        <div className="image-div">
                                            <img className="icons" src="images/logo/WordPress.png" alt="wordpress_link" />
                                        </div>
                                    </a>
                                </div>
                            }
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item sm={12}>
                        <Grid
                            container
                            alignItems="center"
                            direction="column"
                            spacing={24}
                        >
                            <Grid item sm={12}>
                                <button className="myButton" onClick={this.handleStartPostButton}>START POSTING</button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    };
};

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ConnectPage);

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ynuQR from '../ynu.png';
import logo from '../logo.svg';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 6}px 0`,
  }
});

class Footer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          YNU
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          云南大学运维服务部
        </Typography>
        <img src={ require('../ynu.png') } alt="" />
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);

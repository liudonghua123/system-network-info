import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import logo from './logo.svg';
import Header from './components/Header';
import Footer from './components/Footer';
const { remote, ipcRenderer } = window.require('electron');
const { networkInterfaces, getNetworkInterfaces } = remote.require('os');
ipcRenderer.on('networkInterfaces', (evt, msg) => console.log(`evt: ${evt}, msg: ${msg}`));

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  table: {
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      interfaceData: networkInterfaces()
    };
    console.info(`constructor this.state.interfaceData: ${JSON.stringify(this.state.interfaceData)}, ${JSON.stringify(remote.process.versions)}`)
  }

  componentWillMount() {
    this.setState({
      // interfaceData: networkInterfaces()
    });
    // console.info(`componentWillMount this.state.interfaceData: ${JSON.stringify(networkInterfaces())}`)
  }

  createExpansionPanels = (interfaceData) => {
    const { classes } = this.props;
    const expansionPanels = [];
    for (const interfaceName in interfaceData) {
      const contents = (
        <Table className={classes.table}>
          <TableHead>
              <TableRow>
                <TableCell>address</TableCell>
                <TableCell>mac</TableCell>
                <TableCell>netmask</TableCell>
                <TableCell>family</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
              {interfaceData[interfaceName].map(address => (
                <TableRow key={address.address}>
                <TableCell>{address.address}</TableCell>
                <TableCell>{address.mac}</TableCell>
                <TableCell>{address.netmask}</TableCell>
                <TableCell>{address.family}</TableCell>
              </TableRow>
              ))}
            </TableBody>
        </Table>
      );
      const expansionPanel = (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.column}>
                <Typography className={classes.heading}>{ interfaceName }</Typography>
              </div>
              <div className={classes.column}>
                <Typography className={classes.secondaryHeading}>
                  { interfaceData[interfaceName].length }
                  {' addresses of '}
                  { interfaceData[interfaceName][0].mac }
                </Typography>
              </div>
            </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
              <div>
                {contents}
              </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
      );
      expansionPanels.push(expansionPanel);
    }
    return expansionPanels;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Header />
        <div className={classes.root}>
          {this.createExpansionPanels(this.state.interfaceData)}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(App);

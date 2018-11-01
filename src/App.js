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

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import StarIcon from '@material-ui/icons/Star';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


import Paper from '@material-ui/core/Paper';
import logo from './logo.svg';
import Header from './components/Header';
import Footer from './components/Footer';

const { remote, ipcRenderer } = window.require('electron');
const { networkInterfaces, getNetworkInterfaces } = remote.require('os');

ipcRenderer.on('networkInterfaces', (evt, msg) => console.log(`evt: ${evt}, msg: ${msg}`));

const { Resolver } = remote.require('dns');
const resolver = new Resolver();
const dnsServers = resolver.getServers();

const si = remote.require('systeminformation');

const styles = theme => ({
  root: {
    width: '100%',
  },
  card: {
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
      interfaceData: networkInterfaces(),
      si: {
        os: {},
        system: {},
        bios: {},
        baseboard: {},
        cpu: {},
        mem: {}
      },
      open: {
        os: false,
        system: false,
        bios: false,
        baseboard: false,
        cpu: false,
        mem: false,
      }
    };
    console.info(`constructor this.state.interfaceData: ${JSON.stringify(this.state.interfaceData)}, ${JSON.stringify(remote.process.versions)}`);

    (async () => {
      try {
        const os= await si.osInfo();
        const system= await si.system();
        const bios= await si.bios();
        const baseboard= await si.baseboard();
        const cpu= await si.cpu();
        const mem= await si.mem();
        console.log(`${JSON.stringify({ si: { os, system, bios, baseboard, cpu, mem }}, null, 2)}`);
        this.setState({ si: { os, system, bios, baseboard, cpu, mem }})
      } catch (e) {
        console.log(e)
      }
    })();
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

  handleClick = (item) => (e) => {
    this.setState(state => ({ open: { [item]: !state.open[item] }}));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Header />
        <Card className={classes.card}>
          <CardContent>
          {this.createExpansionPanels(this.state.interfaceData)}
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <List
              component="nav"
              subheader={<ListSubheader component="div">System Infomations</ListSubheader>}
            >
              <ListItem button >
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="dns" secondary={ dnsServers.join(", ") } />
              </ListItem>
              
              <ListItem button onClick={this.handleClick('os')}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="os" secondary={ this.state.si.os.distro } />
                {this.state.open.os ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open.os} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "platform" } secondary={ this.state.si.os.platform } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "arch" } secondary={ this.state.si.os.arch } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "distro" } secondary={ this.state.si.os.distro } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "kernel" } secondary={ this.state.si.os.kernel } />
                  </ListItem>
                </List>
              </Collapse>
              
              <ListItem button onClick={this.handleClick('system')}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="system" secondary={ this.state.si.system.manufacturer } />
                {this.state.open.system ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open.system} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "manufacturer" } secondary={ this.state.si.system.manufacturer } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "model" } secondary={ this.state.si.system.model } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "serial" } secondary={ this.state.si.system.serial } />
                  </ListItem>
                </List>
              </Collapse>
              <ListItem button onClick={this.handleClick('cpu')}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="cpu" secondary={ this.state.si.cpu.manufacturer } />
                {this.state.open.cpu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open.cpu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "manufacturer" } secondary={ this.state.si.cpu.manufacturer } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "brand" } secondary={ this.state.si.cpu.brand } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "speed" } secondary={ this.state.si.cpu.speed } />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem button onClick={this.handleClick('mem')}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="mem" secondary={ parseInt(this.state.si.mem.free / 1048576) + " MB Free" } />
                {this.state.open.mem ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open.mem} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "total" } secondary={ parseInt(this.state.si.mem.total / 1048576) + " MB"  } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "free" } secondary={ parseInt(this.state.si.mem.free / 1048576) + " MB" } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "used" } secondary={ parseInt(this.state.si.mem.used / 1048576) + " MB" } />
                  </ListItem>
                </List>
              </Collapse>
              
              <ListItem button onClick={this.handleClick('baseboard')}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="baseboard" secondary={ this.state.si.baseboard.manufacturer } />
                {this.state.open.baseboard ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open.baseboard} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "manufacturer" } secondary={ this.state.si.baseboard.manufacturer } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "model" } secondary={ this.state.si.baseboard.model } />
                  </ListItem>
                  <ListItem button className={classes.nested}>
                    <ListItemText inset primary={ "serial" } secondary={ this.state.si.baseboard.serial } />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </CardContent>
        </Card>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(App);

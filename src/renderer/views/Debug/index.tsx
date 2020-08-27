/* eslint-disable */
import * as React from "react";
import { ipcRenderer } from "electron";
import * as Ago from "s-ago";

import { createStyles, Theme, withStyles, StyleRules } from "@material-ui/core/styles";

import {
    Typography,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";

interface Props {
    classes: any;
}

interface State {
    logs: any[];
}

class Debug extends React.Component<Props, State> {
    state: State = {
        logs: []
    };

    async componentDidMount() {
        ipcRenderer.on("new-log", (event: any, data: any) => {
            // Build the new log
            let newLog = [...this.state.logs, { log: data, timestamp: new Date() }];

            // Make sure there are only 10 logs in the list
            newLog = newLog.slice(newLog.length - 10 < 0 ? 0 : newLog.length - 10, newLog.length);

            // Set the new logs
            this.setState({ logs: newLog });
        });
    }

    invokeMain(event: string, args: any) {
        ipcRenderer.invoke(event, args);
    }

    render() {
        const { classes } = this.props;
        const { logs } = this.state;

        return (
            <section className={classes.root}>
                <Typography variant="h3" className={classes.header}>
                    Server Debugger
                </Typography>
                <br />
                <section className={classes.debugRow}>
                    <Button variant="outlined" onClick={() => this.invokeMain("purge-event-cache", null)}>
                        Purge Event Cache
                    </Button>
                    <Button variant="outlined" onClick={() => this.invokeMain("toggle-tutorial", false)}>
                        Reset Tutorial
                    </Button>
                    <Button variant="outlined" onClick={() => this.invokeMain("restart-server", null)}>
                        Restart Server
                    </Button>
                </section>
                <br />
                <br />
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Log Message (Last 10)</TableCell>
                                <TableCell align="right">Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" className={classes.wrapText}>
                                        {row.log || "N/A"}
                                    </TableCell>
                                    <TableCell align="right">{Ago(row.timestamp)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {logs.length === 0 ? (
                        <p style={{ textAlign: "center" }}>
                            No logs. This page only shows logs while this page is open!
                        </p>
                    ) : null}
                </TableContainer>
            </section>
        );
    }
}

const styles = (theme: Theme): StyleRules<string, {}> =>
    createStyles({
        root: {},
        header: {
            fontWeight: 400
        },
        wrapText: {
            overflowWrap: "break-word",
            maxWidth: "500px"
        },
        debugRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
        }
    });

export default withStyles(styles)(Debug);
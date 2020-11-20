import React, { useCallback, useEffect, useState } from 'react';
import { useGoogleAuth } from '../../googleAuth';
import variables from '../../env';

// EXTERNAL
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import moment from 'moment';

// STYLES
import styles from './CourseView.module.css';

// COMPONENTS
import Panel from '../../components/Panel/Panel';

const CourseView = (props) => {
    const courseId = window.location.pathname.split('courses/')[1]
    const accessToken = useGoogleAuth().googleUser.accessToken
    const [nonActiveStudents, setNonActiveStudents] = useState([])
    const [activeStudents, setActiveStudents] = useState([])
    const [courseName, setCourseName] = useState('...Loading')
    const [loading, setLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [noAssignments, setNoAssignments] = useState(false)
    const [date, setDate] = useState(moment(new Date()).format('MM/DD/YYYY'))
    const [roster, setRoster] = useState([])
    const { refreshUser } = useGoogleAuth()

    const sameDay = (d1, d2) => {
        return moment(d1).format('MM/DD/YYYY') === moment(d2).format('MM/DD/YYYY')
    }

    const remove_duplicates = (arr) => {
        var obj = {};
        var ret_arr = [];
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = true;
        }
        for (var key in obj) {
            ret_arr.push(key);
        }
        return ret_arr;
    }

    const getData = useCallback((date) => {
        (async () => {
            try {
                setLoading(true)
                setNoAssignments(false)
                setHasError(false)

                let activeStudents = [];
                let assignmentsToday = [];

                await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?courseWorkStates=PUBLISHED&key=${variables.APIKEY}`, {
                    headers: {
                        authorization: 'Bearer ' + accessToken
                    }
                }).then((result) => {

                    // get any assignments that were created on the day and that also have a due date on the day
                    result.data.courseWork.forEach((item) => {
                        if ("dueDate" in item && "dueTime" in item && sameDay(new Date(item.creationTime), date)) {
                            const createdAt = new Date(item.creationTime)

                            let hours = item.dueTime.hours
                            if (hours.toString().length === 1) {
                                hours = `0${hours}`
                            }
                            const dueDate = new Date(`${item.dueDate.year}-${item.dueDate.month}-${item.dueDate.day}T${hours}:${item.dueTime.minutes}:00.000Z`)

                            if (sameDay(createdAt, dueDate)) {
                                assignmentsToday.push(item)
                            }
                        }
                    })
                })

                if (assignmentsToday.length === 0) {
                    setNoAssignments(true)
                    setLoading(false)
                    setActiveStudents([])
                    setNonActiveStudents([])
                    return;
                }

                // gets all active students from today
                await Promise.all(assignmentsToday.map(async (assignment) => {
                    // get submissions for each assignment 
                    await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${assignment.id}/studentSubmissions?key=${variables.APIKEY}`, {
                        headers: {
                            authorization: 'Bearer ' + accessToken
                        }
                    }).then((result) => {
                        const students = [];

                        result.data.studentSubmissions.forEach((submission) => {
                            if ("late" in submission) {
                                return
                            }
                            students.push(submission.userId)
                        })
                        activeStudents.push(...students)
                    })
                }))

                // remove duplicates
                activeStudents = remove_duplicates(activeStudents)

                const activeStudentNames = [];
                const nonActiveStudentNames = [];

                // loop through class roster and determine whether student is in active students list
                if (assignmentsToday.length > 0) {
                    roster.forEach((student) => {
                        if (activeStudents.filter(AS => AS === student.profile.id).length > 0) {
                            activeStudentNames.push(`${student.profile.name.familyName}, ${student.profile.name.givenName}`)
                        } else {
                            nonActiveStudentNames.push(`${student.profile.name.familyName}, ${student.profile.name.givenName}`)
                        }
                    })
                }

                setActiveStudents(activeStudentNames)
                setNonActiveStudents(nonActiveStudentNames)
                setLoading(false)

            } catch (err) {
                if (err.toString().includes('401')) {
                    refreshUser()
                }
                console.log(err)
                setLoading(false)
                setHasError(true)
            }
        })();
    }, [courseId, accessToken, refreshUser, roster])

    useEffect(() => {
        if (roster.length > 0 || courseName !== '...Loading') {
            return;
        }
        axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}?key=${variables.APIKEY}`, {
            headers: {
                authorization: 'Bearer ' + accessToken
            }
        }).then((result) => {
            setCourseName(result.data.name)
        })

        axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/students?key=${variables.APIKEY}`, {
            headers: {
                authorization: 'Bearer ' + accessToken
            }
        }).then((result) => {
            setRoster(result.data.students)
            getData(new Date())
        })
    }, [accessToken, courseId, getData, courseName, roster.length])



    return (
        <div className={styles.CourseView}>
            <div className={styles.TopContainer}>
                <div className={styles.GoBack} onClick={() => props.history.goBack()}>
                    <MdArrowBack color={"rgba(94, 129, 244, 1)"} size={30} style={{ marginRight: '10px' }} />
                    <span>Go back</span>
                </div>

                <h2>{hasError ? 'Error loading content' : courseName}</h2>

                <div className={styles.Placeholder}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            value={date}
                            disableFuture
                            onChange={value => {
                                if (!loading) {
                                    setDate(moment(value).format('MM/DD/YYYY'))
                                    getData(new Date(value))
                                }
                            }}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </div>

            <div className={styles.BottomContainer}>
                <Panel noAssignments={noAssignments} loading={loading} students={activeStudents.sort()} title={"Active students today"} />
                <Panel noAssignments={noAssignments} loading={loading} students={nonActiveStudents.sort()} title={"Non-active students today"} />
            </div>
        </div>
    )
}

export default CourseView;
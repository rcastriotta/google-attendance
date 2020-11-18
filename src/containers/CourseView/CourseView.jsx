import React, { useEffect, useState } from 'react';
import { useGoogleAuth } from '../../googleAuth';
import variables from '../../env';

// EXTERNAL
import axios from 'axios';
import { MdArrowBack } from 'react-icons/md';

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

    const sameDay = (d1, d2) => {
        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
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

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                let allStudents;
                let activeStudents = [];
                let assignmentsToday;

                const getCourseName = await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}?key=${variables.APIKEY}`, {
                    headers: {
                        authorization: 'Bearer ' + accessToken
                    }
                }).then((result) => {
                    setCourseName(result.data.name)
                })

                const getCourseWork = await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?key=${variables.APIKEY}`, {
                    headers: {
                        authorization: 'Bearer ' + accessToken
                    }
                }).then((result) => {

                    // TESTING PURPOSES
                    let testDate = new Date()
                    testDate.setDate(testDate.getDate() - 2);
                    // -----------

                    assignmentsToday = result.data.courseWork.filter(course => sameDay(new Date(course.creationTime), testDate))
                })

                if (assignmentsToday.length === 0) {
                    return
                }


                const getClassRoster = await axios.get(`https://classroom.googleapis.com/v1/courses/${courseId}/students?key=${variables.APIKEY}`, {
                    headers: {
                        authorization: 'Bearer ' + accessToken
                    }
                }).then((result) => {
                    allStudents = result.data.students
                })

                // gets all coursework and class roster
                await Promise.all([getCourseName, getCourseWork, getClassRoster])


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
                            if (submission.state === 'TURNED_IN') {
                                students.push(submission.userId)
                            }
                        })
                        activeStudents.push(...students)
                    })
                }))

                // remove duplicates
                activeStudents = remove_duplicates(activeStudents)

                const activeStudentNames = [];
                const nonActiveStudentNames = [];

                if (assignmentsToday.length > 0) {
                    allStudents.forEach((student) => {
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
                console.log(err)
                setLoading(false)
                setHasError(true)
            }
        })();
    }, [courseId, accessToken])



    return (
        <div className={styles.CourseView}>
            <div className={styles.TopContainer}>
                <div className={styles.GoBack} onClick={() => props.history.goBack()}>
                    <MdArrowBack color={"rgba(94, 129, 244, 1)"} size={30} style={{ marginRight: '10px' }} />
                    <span>Go back</span>
                </div>

                <h2>{hasError ? 'Error loading content' : courseName}</h2>

                <div className={styles.Placeholder} />
            </div>

            <div className={styles.BottomContainer}>
                <Panel loading={loading} students={activeStudents.sort()} title={"Active students today"} />
                <Panel loading={loading} students={nonActiveStudents.sort()} title={"Non-active students today"} />
            </div>
        </div>
    )
}

export default CourseView;
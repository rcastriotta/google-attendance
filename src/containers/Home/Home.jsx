import React, { useEffect, useState } from 'react';
import { useGoogleAuth } from '../../googleAuth';
import variables from '../../env';
// EXTERNAL
import axios from 'axios'
import { GridList, GridListTile, Menu, MenuItem } from '@material-ui/core';
import dateformat from 'dateformat';
import { MdArrowForward } from 'react-icons/md';
import { FiMoreVertical } from 'react-icons/fi';
import Loader from 'react-loader-spinner'

// STYLES
import styles from './Home.module.css';

const Home = (props) => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const accessToken = useGoogleAuth().googleUser.accessToken
    const googleId = useGoogleAuth().googleUser.googleId
    const name = useGoogleAuth().googleUser.profileObj.givenName
    const [anchorEl, open] = React.useState(null);
    const { signOut } = useGoogleAuth();
    const { refreshUser } = useGoogleAuth()


    useEffect(() => {
        setIsLoading(true)
        axios.get(`https://content-classroom.googleapis.com/v1/courses?courseStates=ACTIVE&key=${variables.APIKEY}`, {
            headers: {
                authorization: 'Bearer ' + accessToken
            }
        })
            .then((response) => {
                setIsLoading(false)
                const courses = response.data.courses
                const activeCourses = courses.filter(course => course.ownerId === googleId)
                setCourses(activeCourses)
            })
            .catch((err) => {
                if (err.toString().includes('401')) {
                    refreshUser()
                }
                setIsLoading(false)
            })
    }, [accessToken, googleId, props.history, refreshUser])

    const handleClick = event => {
        open(event.currentTarget);
    };

    const handleClose = () => {
        open(null);
    };



    return (
        <div className={styles.Home}>
            <div className={styles.NameContainer}>
                <div style={{ marginLeft: '50px' }}>
                    <h2>Hello, {name}</h2>
                    <div className={styles.Total}>
                        <p>ACTIVE CLASSES</p>
                        <div className={styles.Divider} />
                        <h4 style={{ color: 'rgba(94, 129, 244, 1)' }}>{courses.length} total</h4>
                    </div>

                </div>
                <div className={styles.Ellipse} onClick={handleClick}>
                    <FiMoreVertical color={"rgba(94, 129, 244, 1)"} size={30} style={{}} />
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}

                    onClose={handleClose}

                >
                    <MenuItem onClick={signOut} style={{ color: 'rgba(94, 129, 244, 1)', fontFamily: 'averta-bold' }}>Logout</MenuItem>
                </Menu>


            </div>
            {!isLoading && <GridList cellHeight={160} cols={4} className={styles.Tiles} padding={20} spacing={0} style={{ overflow: 'visible' }} >
                {courses.map((course) => {
                    return (
                        <GridListTile key={course.id} cols={1} className={styles.Tile} onClick={() => props.history.push(`/courses/${course.id}`)}>
                            <div className={styles.TileTop}>
                                <h3>{course.name}</h3>
                                <div className={styles.Date}>
                                    <p style={{ color: 'gray' }}>Created</p>
                                    <div className={styles.Divider} />
                                    <p style={{ color: 'rgba(94, 129, 244, 1)' }}>{dateformat(course.creationTime)}</p>
                                </div>

                            </div>
                            <div className={styles.TileBottom}>
                                <div className={styles.ViewAttendance}>
                                    <span>View attendance</span>
                                    <MdArrowForward color={"rgba(94, 129, 244, 1)"} size={25} style={{ marginLeft: "10px", marginRight: "20px" }} />
                                </div>
                            </div>
                        </GridListTile>
                    )
                })}
                <div style={{ height: '50px' }} />

            </GridList>}
            {
                isLoading && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <Loader
                        type="TailSpin"
                        color={'rgba(94, 129, 244, 1)'}
                        height={"100px"}
                        width={"100px"}
                        style={{ marginTop: '200px' }}
                    />
                </div>
            }
        </div >


    )
}

export default Home;
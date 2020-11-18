import React from 'react';

// STYLES
import styles from './Panel.module.css';

// EXTERNAL
import { MdPrint } from 'react-icons/md';
import Loader from 'react-loader-spinner'

const Panel = (props) => {
    let count = 0;
    return (
        <div className={styles.Panel}>
            <div className={styles.Top}>
                <div className={styles.Title}>
                    <h3>{props.title}</h3>
                    <MdPrint color={"rgba(94, 129, 244, 1)"} size={25} />
                </div>
                <span style={{ color: 'gray' }}>{props.students.length} total</span>
            </div>

            <div className={styles.Bottom}>
                {!props.loading && <div className={styles.List}>
                    {props.students.map(student => {
                        count++
                        return (
                            <div key={Math.random()} className={styles.ListItem}>
                                <span style={{ fontFamily: 'averta-bold' }}>{student}</span>
                                <span style={{ color: 'rgba(94, 129, 244, 1)' }}>{count}</span>
                            </div>
                        )
                    })}
                </div>}
                {props.loading &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Loader
                            type="TailSpin"
                            color={'rgba(94, 129, 244, 1)'}
                            height={"100px"}
                            width={"100px"}
                            style={{
                                marginTop: '50px'
                            }}
                        />
                    </div>}
            </div>


        </div>
    )
}

export default Panel;
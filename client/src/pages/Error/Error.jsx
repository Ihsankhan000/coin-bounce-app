import { Link } from "react-router-dom"
import styles from './Error.module.css'

function Error(){
return (
    <div className={styles.errorWrapper}>
       <div className={styles.errorHeader}> Error 404 - Page not found </div>
       <div className={styles.errorBody}>
        Go back to <Link className={styles.homeLink} to='/'>home</Link>
       </div>

    </div>
    
)
}

export default Error
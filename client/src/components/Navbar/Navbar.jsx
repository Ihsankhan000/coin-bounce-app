import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css';
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../api/internal";
import { resetUser } from "../../store/userSlice";


function Navbar () {
  const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.user.auth);

      const handleSignout = async () => {
         await signout();
         dispatch(resetUser()); 
      }


    return (
      <>
        <nav className={styles.navbar}>
          <NavLink to='/' className={`${styles.logo} ${styles.inActiveStyle}`}>CoinBounce</NavLink>

          <NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='/'>Home</NavLink>
          <NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='crypto' >Cryptocurrencies</NavLink>
          <NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='blogs' >Blogs</NavLink>
          <NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='submit' >Submit a Blog</NavLink>
          
          {
            isAuthenticated ? <div> <NavLink><button className={styles.signOutButton} onClick={handleSignout}>Sign Out</button></NavLink></div> :
          <div><NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='login'> <button className={styles.logInButton}>Log In</button> </NavLink>
          <NavLink className={({isActive}) => isActive ? styles.activeStyle : styles.inActiveStyle} to='signup' > <button className={styles.signUpButton}>Sign Up</button> </NavLink></div>
        }

        </nav>


        <div className={styles.separator}>  

        </div>
      </> 
    )
}

export default Navbar;










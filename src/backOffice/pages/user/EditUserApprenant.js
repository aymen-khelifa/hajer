import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {fetchUserDetails2, dispatchGetUserDetails2} from '../../../redux/actions/authAction'
import {isLength, isMatch} from '../../../components/utils/validation/Validation'
import { Button,Form} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import './EditUser.css'
import SnackbarErr from '../../components/Snackbar/SnackbarErr'
import SnackbarSuccess from '../../components/Snackbar/SnackbarSuccess'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Snackbar, Alert} from "@mui/material";
        const initialState = {
            name: '',
            phone:'',
            email:'',
            speciality:'',
            password:'',
            cf_password: '',
            err: '',
            success: ''
        }

function EditUserApprenant() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const {apprenant} = auth
    const [data, setData] = useState(initialState)
   // const {name,phone,email,speciality,password, cf_password, err, success} = data
    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback] = useState(false)
    const dispatch = useDispatch()
    const {id} = useParams()
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [tel, setTel] = useState("");
    const [telError, setTelError] = useState(false);
    const [err , setErr] = useState("");
    const [success , setSuccess] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState("");
        useEffect(() => {
          fetchUserDetails2(token,id).then(res =>{
                dispatch(dispatchGetUserDetails2(res))
            })
        },[token,id, dispatch, callback])
        console.log(apprenant)

    /*    const handleChange = e => {

            const {name, value} = e.target

            setData({...data, [name]:value, err:'', success: ''})
        }*/

        const changeAvatar = async(e) => {
            e.preventDefault()
            try {
                const file = e.target.files[0]

                if(!file) return setData({...data, err: "Aucun fichier n'a été téléchargé." , success: 'Photo téléchargée'})

                if(file.size > 1024 * 1024)
                    return setData({...data, err: "Taille trop grande." , success: 'Photo téléchargée'})

                if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                    return setData({...data, err: "Le format de fichier est incorrect." , success: 'Photo téléchargée'})

                let formData =  new FormData()
                formData.append('file', file)

                setLoading(true)
                const res = await axios.post('/api/upload_avatar', formData, {
                    headers: {'content-type': 'multipart/form-data', Authorization: token}
                })

                setLoading(false)
                setAvatar(res.data.url)
                setOpen(true);
                
            } catch (err) {
                setData({...data, err: err.response.data.msg , success: ''})
                setOpen2(true);

            }
        }
   
        const updateInfor = () => {
            try {
                axios.patch(`http://localhost:5000/users/editprofileapprenant/${id}`, {
                    name: name ,
                    avatar: avatar ,
                    tel: tel ,
                    email: email ,
                    password:password,

                },{
                    headers: {Authorization: token}
                })

                setData({...data, err: '' , success: "Profile modifié!"})
                setOpen(true);
                window.location.reload(false);
            } catch (err) {
                setData({...data, err: err.response.data.msg , success: ''})
                setOpen2(true);
            }
        }

 /*   const updatePassword = () => {
        if(isLength(password))
            return setData({...data, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleUpdate = () => {
        if(name || avatar || phone || speciality || email) updateInfor()
        if(password) updatePassword()
    }*/
    const isFormValid = () => {
      // add validation rules here
      return  email !== '' && password !== ''  && name !== '' && tel !== '' && !emailError && !passwordError
      && !nameError && !telError ;
    };
    const handleEmailChange = (event) => {
      const { value } = event.target;
      setEmail(value);
      setEmailError(value === '' || !/\S+@\S+\.\S+/.test(value));
    };
    const handleNameChange = (event) => {
      const { value } = event.target;
      setName(value);
      setNameError(value.length < 3);
    };
    const handleTelChange = (event) => {
      const { value } = event.target;
      setTel(value);
      setTelError(!/^\d{8}$/.test(value));
    };
    const handlePasswordChange = (event) => {
      const { value } = event.target;
      setPassword(value);
      setPasswordError(value.length < 8);
    };
    const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
      <div className='content-user'>
       <h3 className='title-photo'>Photo de profile</h3>
       <Form className='form-profil'>
       <Form.Group className="mb-3">
         <div className='profile-pic-div'>
         <img src={ apprenant.avatar} alt="" className="avatar-img" />
           <div className="uploadBtn">
           <Form.Label htmlFor="file"> 
            <PhotoCameraIcon className='icon-camera'/>
           </Form.Label>
           </div>
         </div>
         <Form.Control type="file"  id="file"
              name="avatar"
              //defaultValue={instructeur.avatar}
              onChange={changeAvatar}
              style={{display:"none"}}
          />
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label className="label">Nom complet</Form.Label>
              <Form.Control type="text" placeholder={apprenant.name} 
                name="name" 
                required 
                defaultValue={apprenant.name}
                onChange={handleNameChange}
                    isInvalid={nameError}                            
                    /><Form.Control.Feedback type="invalid">
              Name is required and at least 3 character
               </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label className="label">Adresse e-mail</Form.Label>
              <Form.Control type="email" placeholder={apprenant.email} 
                name="email" 
               defaultValue={apprenant.email}
               onChange={handleEmailChange}
            isInvalid={emailError} 
             />
              <Form.Control.Feedback type="invalid">
              saisir un  email addresse valide
               </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" >
            <Form.Label className="label">Numéro de téléphone</Form.Label>
              <Form.Control type="text" placeholder={apprenant.tel} 
                name="phone" 
              defaultValue={apprenant.tel}
              onChange={handleTelChange}
                    
                    isInvalid={telError}
         />
          <Form.Control.Feedback type="invalid">
          saisir un numero de  telephone valide
               </Form.Control.Feedback>
          </Form.Group>
         
          
          <Form.Group className="mb-3" >
            <Form.Label className="label">Mot de passe</Form.Label>
              <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Entrer mot de passe" 
                name="password" 
              defaultValue={apprenant.password}
              onChange={handlePasswordChange}
              isInvalid={passwordError}
            /><IconButton className='eye' style={{position:'absolute',marginLeft:'420px',marginTop:'-31px'}} variant="outline-secondary" onClick={handleClickShowPassword}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
                <Form.Control.Feedback type="invalid">
             mot de passe contient 8 caracteres
              </Form.Control.Feedback> 
          </Form.Group>
          
          <div className="content-btn">
                  <Button className='btn-annnuler' href="/apprenants">Annuler</Button>
                  <Button  onClick={updateInfor} disabled={!isFormValid()} className='btn-confirme'>Sauvegarder les modifications</Button>
           </div>
        </Form>
        <Snackbar autoHideDuration={2500} open={ err === "" ? false : true } onClose={()=>{ setErr("") }}  >
        <Alert variant="filled" severity="error" onClose={()=>{ setErr("") }} >
          {
            err
          }
        </Alert>
      </Snackbar>
      <Snackbar autoHideDuration={2500} open={ success === "" ? false : true } onClose={()=>{ setSuccess("") }}  >
        <Alert variant="filled" severity="success" onClose={()=>{ setSuccess("") }} >
          {
            success
          }
        </Alert>
      </Snackbar>
    </div>
  )
}

export default EditUserApprenant;
//<option defaultValue={instructeur.instructeur.speciality}>{instructeur.instructeur.speciality}</option>
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AUTH_LOGIN } from '../../../utils/endpoints';
import { LoginSchema } from './schema.ts';
import { AppContext, AuthContext } from '../../../context/context';
import Iconify from '../../../components/iconify';
import { Toast } from '../../../components/Toast';
import axios from 'axios'
// ----------------------------------------------------------------------
export default function LoginForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setError,
    getFieldState,
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();
  const { addToast } = Toast()
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(AppContext)

  const showErrorInInvalidField = (fieldName, showFieldName) => {

    if (getFieldState(fieldName).invalid) {
      return <p style={{ color: 'red' }}>Insira uma {showFieldName} válida</p>
    }
  }
  const onSubmit = async (data) => {
    try {
      console.log("COMBI: ", data);
      /*if () {
        addToast({
          title: "Insira um utilizador válido",
          status: "warning"
        })
      }

      if () {
        addToast({
          title: "Insira uma palavra-passe válida",
          status: "warning"
        })
      }*/
      const response = await axios.post(process.env.REACT_APP_API_URL_DEV + AUTH_LOGIN, data)
      if (response.status === 200 && response.data?.access_token) {
        setUserData(response.data)
        localStorage.setItem('userData', JSON.stringify(response.data))
        setUserData(response.data)
        navigate('/dashboard', { replace: true });
      } else {
        addToast({
          title: "Combinação Senha e email incorreta ou Contacte o administrador verificando se os seus armazéns estão activos",
          status: "warning"
        })
      }
    } catch (e) {
      addToast({
        title: e.error,
        status: "warning"
      })
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField {...register("email")} name="email" label="Email" />
          {showErrorInInvalidField("email", "E-mail")}
          <TextField
            name="password"
            label="Senha"
            {...register("password")}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {showErrorInInvalidField("password", "Senha")}


        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Link variant="subtitle2" underline="hover">
            Recuperar Senha
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Entrar
        </LoadingButton>
      </form>
    </>
  );
}

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter, useParams } from 'src/routes/hook';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { CreateApi, singleViewofVillaByID, UpdateVillaByIDApiCall } from 'src/api/ZedSoft/villa';
import { useSelector } from 'react-redux';
import { store } from 'src/redux/store';
import { singleViewOfVillastate } from 'src/redux/slices/villaslice';

export default function RealEstateForm({ currentProperty }) {
  const { singleViewofVilla } = useSelector((state) => state.villa);
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [includeTaxes, setIncludeTaxes] = useState(false);

  const RealEstateSchema = Yup.object().shape({
    location: Yup.string().required('Location is required'),
    locationdesc: Yup.string().required('Location description is required'),
    pptyoverviewdesc: Yup.string().required('Property description is required'),
    amenities: Yup.string().required('Amenities are required'),
    aedprice: Yup.number().moreThan(0, 'Price should not be 0'),
    totalreturn: Yup.number().moreThan(0, '5-year total return should not be 0'),
    investmentreturn: Yup.number().moreThan(0, 'Yearly investment return should not be 0'),
    netyield: Yup.number().moreThan(0, 'Projected net yield should not be 0'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().moreThan(0, 'Price should not be 0'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('Zip code is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentProperty?.title || '',
      description: currentProperty?.description || '',
      price: currentProperty?.price || '',
      address: currentProperty?.address || '',
      city: currentProperty?.city || '',
      state: currentProperty?.state || '',
      zip: currentProperty?.zip || '',
      location: currentProperty?.location || '',
      locationdesc: currentProperty?.locationdesc || '',
      pptyoverviewdesc: currentProperty?.pptyoverviewdesc || '',
      amenities: currentProperty?.amenities || '',
      aedprice: currentProperty?.aedprice || '',
      totalreturn: currentProperty?.totalreturn || '',
      investmentreturn: currentProperty?.investmentreturn || '',
      netyield: currentProperty?.netyield || '',
    }),
    [currentProperty]
  );

  const methods = useForm({
    resolver: yupResolver(RealEstateSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProperty) {
      reset(defaultValues);
    }
  }, [currentProperty, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProperty?.taxes || 0);
    }
  }, [currentProperty?.taxes, includeTaxes, setValue]);

  const successfun = () => {
    reset();
    enqueueSnackbar(!id ? 'Create success!' : 'Update success!');
    router.push(paths.dashboard.product.root);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formdata = new FormData();

      formdata.append('aedprice', data.aedprice);
      formdata.append('investmentreturn', data.investmentreturn);
      formdata.append('location', data.location);
      formdata.append('netyield', data.netyield);
      formdata.append('totalreturn', data.totalreturn);
      formdata.append('locationdesc', data.locationdesc);
      formdata.append('pptyoverviewdesc', data.pptyoverviewdesc);
      formdata.append('amenities', data.amenities);
      formdata.append('title', data.title);
      formdata.append('description', data.description);
      formdata.append('price', data.price);
      formdata.append('address', data.address);
      formdata.append('city', data.city);
      formdata.append('state', data.state);
      formdata.append('zip', data.zip);

      if (!id) {
        await CreateApi(formdata, successfun);
      } else {
        formdata.append('id', id);
        await UpdateVillaByIDApiCall(formdata, successfun);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  });

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  useEffect(() => {
    if (id) {
      singleViewofVillaByID(id);
    }
    return () => {
      store.dispatch(singleViewOfVillastate({ data: [] }));
    };
  }, [id]);

  useEffect(() => {
    setValue('heading', singleViewofVilla?.heading || '');
    setValue('location', singleViewofVilla?.location || '');
    setValue('locationdesc', singleViewofVilla?.locationdesc || '');
    setValue('pptyoverviewdesc', singleViewofVilla?.pptyoverviewdesc || '');
    setValue('amenities', singleViewofVilla?.amenities || '');
    setValue('aedprice', singleViewofVilla?.aedprice || '');
    setValue('totalreturn', singleViewofVilla?.totalreturn || '');
    setValue('investmentreturn', singleViewofVilla?.investmentreturn || '');
    setValue('netyield', singleViewofVilla?.netyield || '');
    setValue('title', singleViewofVilla?.title || '');
    setValue('description', singleViewofVilla?.description || '');
    setValue('price', singleViewofVilla?.price || '');
    setValue('address', singleViewofVilla?.address || '');
    setValue('city', singleViewofVilla?.city || '');
    setValue('state', singleViewofVilla?.state || '');
    setValue('zip', singleViewofVilla?.zip || '');
  }, [singleViewofVilla, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h4" gutterBottom>
       Create Real Estate
      </Typography>
      <Grid  spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="title" label="Title" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="price" label="Price" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="description" label="Description" multiline rows={4} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="address" label="Address" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="city" label="City" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>State</InputLabel>
                    <Select
                      name="state"
                      value={values.state}
                      onChange={(e) => setValue('state', e.target.value)}
                      label="State"
                    >
                      <MenuItem value="AP">Andhra Pradesh</MenuItem>
                      <MenuItem value="AR">Arunachal Pradesh</MenuItem>
                      <MenuItem value="AS">Assam</MenuItem>
                      <MenuItem value="BR">Bihar</MenuItem>
                      <MenuItem value="CT">Chhattisgarh</MenuItem>
                      <MenuItem value="GA">Goa</MenuItem>
                      <MenuItem value="GJ">Gujarat</MenuItem>
                      <MenuItem value="HR">Haryana</MenuItem>
                      <MenuItem value="HP">Himachal Pradesh</MenuItem>
                      <MenuItem value="JK">Jammu and Kashmir</MenuItem>
                      <MenuItem value="JH">Jharkhand</MenuItem>
                      <MenuItem value="KA">Karnataka</MenuItem>
                      <MenuItem value="KL">Kerala</MenuItem>
                      <MenuItem value="MP">Madhya Pradesh</MenuItem>
                      <MenuItem value="MH">Maharashtra</MenuItem>
                      <MenuItem value="MN">Manipur</MenuItem>
                      <MenuItem value="ML">Meghalaya</MenuItem>
                      <MenuItem value="MZ">Mizoram</MenuItem>
                      <MenuItem value="NL">Nagaland</MenuItem>
                      <MenuItem value="OD">Odisha</MenuItem>
                      <MenuItem value="PY">Puducherry</MenuItem>
                      <MenuItem value="PB">Punjab</MenuItem>
                      <MenuItem value="RJ">Rajasthan</MenuItem>
                      <MenuItem value="SK">Sikkim</MenuItem>
                      <MenuItem value="TN">Tamil Nadu</MenuItem>
                      <MenuItem value="TS">Telangana</MenuItem>
                      <MenuItem value="TR">Tripura</MenuItem>
                      <MenuItem value="UP">Uttar Pradesh</MenuItem>
                      <MenuItem value="UT">Uttarakhand</MenuItem>
                      <MenuItem value="WB">West Bengal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="zip" label="Zip Code" fullWidth />
                </Grid>
              </Grid>
            </Box>
            <Stack spacing={3} sx={{ p: 3 }}>
              <FormControlLabel
                control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
                label={
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Price includes taxes
                  </Typography>
                }
              />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3, justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!id ? 'Create Property' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

RealEstateForm.propTypes = {
  currentProperty: PropTypes.object,
};

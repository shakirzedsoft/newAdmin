import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hook';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';
import { useParams } from 'src/routes/hook';
import { CreateApi, singleViewofVillaByID, UpdateVillaByIDApiCall } from 'src/api/ZedSoft/villa';
import { useSelector } from 'react-redux';
import { store } from 'src/redux/store';
import { singleViewOfVillastate } from 'src/redux/slices/villaslice';
import { imgbaseurl } from 'src/utils/zedSoftadminAxios';


// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {


  const { singleViewofVilla } = useSelector((state) => state.villa);

  console.log(singleViewofVilla)

  const params = useParams();

  const { id } = params;
  console.log(id)
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    roomno: Yup.number().moreThan(0, 'Room No should not be $0.00'),
    heading: Yup.string().required('heading is required'),
    images: Yup.array().min(1, 'Images is required'),


    document: Yup.array().min(1, 'Document is required'),


    noofbed: Yup.number().moreThan(0, 'No of bed should not be 0'),
    sqft: Yup.number().moreThan(0, 'Sqft should not be $0.00'),
    location: Yup.string().required('location is required'),
    status: Yup.string().required('status is required'),
    locationdesc: Yup.string().required('Location Desc is required'),
    pptyoverviewdesc: Yup.string().required('Property Desc is required'),
    amenities: Yup.string().required('Amenities is required'),
    aedprice: Yup.number().moreThan(0, 'AED Price should not be $0.00'),
    totalreturn: Yup.number().moreThan(0, '5 year total return should not be $0.00'),
    investmentreturn: Yup.number().moreThan(0, 'Yearly investment return should not be $0.00'),
    netyield: Yup.number().moreThan(0, 'Projected net yield should not be $0.00'),

    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // category: Yup.string().required('Category is required'),
    // price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    // description: Yup.string().required('Description is required'),
    // // not required
    // taxes: Yup.number(),
    // newLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),
    // saleLabel: Yup.object().shape({
    //   enabled: Yup.boolean(),
    //   content: Yup.string(),
    // }),

  });

  const defaultValues = useMemo(
    () => ({
      // name: currentProduct?.name || '',
      roomno: '',
      heading: "",
      // description: currentProduct?.description || '',
      // subDescription: currentProduct?.subDescription || '',
      images: [],

      document: [],

      noofbed: "",
      sqft: "",
      location: "",
      status: "",
      locationdesc: "",
      pptyoverviewdesc: "",
      amenities: "",
      aedprice: "",
      totalreturn: "",
      investmentreturn: "",
      netyield: "",
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      // price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || '',
      // category: currentProduct?.category || '',
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },

    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);



  //successfun
  const successfun = () => {
    reset();
    enqueueSnackbar(!id ? 'Create success!' : 'Update success!');
    router.push(paths.dashboard.product.root);
  }


  const onSubmit = handleSubmit(async (data) => {

    console.log(data)

    try {


      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      // enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.product.root);
      // console.info('DATA', data);

      const formdata = new FormData();

      //imagges
      if (data?.images) {
        for (let i = 0; i < data.images.length; i++) {
          formdata.append('images', data.images[i]);
        }
      }

      //document
      if (data?.document) {
        for (let i = 0; i < data.document.length; i++) {
          formdata.append('images', data.document[i]);
        }
      }



      formdata.append('aedprice', data?.aedprice)
      formdata.append('investmentreturn', data?.investmentreturn)
      formdata.append('location', data?.location)
      formdata.append('netyield', data?.netyield)
      formdata.append('noofbed', data?.noofbed)
      formdata.append('roomno', data?.roomno)
      formdata.append('status', data?.status)
      formdata.append('heading', data?.heading)
      formdata.append('totalreturn', data?.totalreturn)
      formdata.append('sqft', data?.sqft)
      formdata.append('locationdesc', data?.locationdesc)
      formdata.append('pptyoverviewdesc', data?.pptyoverviewdesc)
      formdata.append('amenities', data?.amenities)

      if (!id) {

        CreateApi(formdata, successfun)

      } else if (id) {
        // window.alert("UPDATE>>>")
        formdata.append('id', id)
        UpdateVillaByIDApiCall(formdata, successfun)
      }


    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      console.log("FIles>>>>>>>>>>>>>>>>>", files)

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event) => {
    setIncludeTaxes(event.target.checked);
  }, []);






  //document pdf upload
  const DocumenthandleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.document || [];
      // console.log("FIles>>>>>>>>>>>>>>>>>", files)

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('document', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.document]
  );


  const documenthandleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.document && values.document?.filter((file) => file !== inputFile);
      setValue('document', filtered);
    },
    [setValue, values.document]
  );


  const DocumenthandleRemoveAllFiles = useCallback(() => {
    setValue('document', []);
  }, [setValue]);





  //useEffect
  useEffect(() => {
    if (id !== undefined) {
      singleViewofVillaByID(id)
    }
    return () => { // componentwill unmount
      // window.alert("III")
      store.dispatch(singleViewOfVillastate({ data: [] }))
    }
  }, [id])




  //useEffect
  useEffect(() => {

    setValue('roomno', singleViewofVilla?.roomno ? singleViewofVilla?.roomno : "")
    setValue('heading', singleViewofVilla?.heading ? singleViewofVilla?.heading : "")
    //image
    setValue('images', singleViewofVilla?.image ? singleViewofVilla?.image.map(item => imgbaseurl + item) : [])

    //document
    setValue('document',singleViewofVilla?.document ? singleViewofVilla?.document.map(item=>imgbaseurl + item): [])

    setValue('noofbed', singleViewofVilla?.noofbed ? singleViewofVilla?.noofbed : "")
    setValue('sqft', singleViewofVilla?.sqft ? singleViewofVilla?.sqft : "")
    setValue('location', singleViewofVilla?.location ? singleViewofVilla?.location : "")
    setValue('status', singleViewofVilla?.status ? singleViewofVilla?.status : "")
    setValue('locationdesc', singleViewofVilla?.locationdesc ? singleViewofVilla?.locationdesc : "")
    setValue('pptyoverviewdesc', singleViewofVilla?.pptyoverviewdesc ? singleViewofVilla?.pptyoverviewdesc : "")
    setValue('amenities', singleViewofVilla?.amenities ? singleViewofVilla?.amenities : "")
    setValue('aedprice', singleViewofVilla?.aedprice ? singleViewofVilla?.aedprice : "")
    setValue('totalreturn', singleViewofVilla?.fiveyrtotalreturn ? singleViewofVilla?.fiveyrtotalreturn : "")
    setValue('investmentreturn', singleViewofVilla?.yearlyinvsmtreturn ? singleViewofVilla?.yearlyinvsmtreturn : "")
    setValue('netyield', singleViewofVilla?.projectednetyeld ? singleViewofVilla?.projectednetyeld : "");

  }, [setValue, singleViewofVilla])








  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* <RHFTextField name="name" label="Product Name" /> */}

            <RHFTextField name="roomno" label="Room No" type="number" />


            <RHFTextField name="heading" label="Heading" multiline rows={4} />

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack> */}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>





            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Document</Typography>
              <RHFUpload

                file={'document'}

                multiple
                thumbnail
                name="document"
                maxSize={3145728}
                onDrop={DocumenthandleDrop}
                onRemove={documenthandleRemoveFile}
                onRemoveAll={DocumenthandleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>


          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              {/* <RHFTextField name="code" label="Product Code" /> */}

              <RHFTextField name="noofbed" label="No of Bed" type="number" />

              <RHFTextField name="sqft" label="Sq.ft" type="number" />

              {/* <RHFTextField name="sku" label="Product SKU" /> */}
              <RHFTextField name="location" label="Location" />


              <RHFTextField name="status" label="Status" />

              <RHFTextField name="locationdesc" label="Location Desc" multiline rows={4} />

              <RHFTextField name="pptyoverviewdesc" label="Property Desc" multiline rows={4} />


              <RHFTextField name="amenities" label="Amenities" />

              {/* <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              /> */}

              {/* <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect> */}

              {/* <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              /> */}

              {/* <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} /> */}
            </Box>

            {/* <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}

            {/* <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack> */}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel.enabled}
              />
            </Stack> */}

            {/* <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel.enabled}
              />
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>

            {/* <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}


            <RHFTextField
              name="aedprice"
              label="AED Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="totalreturn"
              label="5 year total return"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />


            <RHFTextField
              name="investmentreturn"
              label="Yearly investment return"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />


            <RHFTextField
              name="netyield"
              label="Projected net yield"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />


            {/* <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            /> */}

            {/* <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            /> */}

            {/* {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )} */}


          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {/* {!currentProduct ? 'Create Product' : 'Save Changes'} */}

          {!id ? 'Create Villa' : 'Save Changes'}

        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};

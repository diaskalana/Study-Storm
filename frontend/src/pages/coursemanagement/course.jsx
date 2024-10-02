import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Switch, TextField, Typography } from "@mui/material"
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { courseApi } from "../../utils/api";
import createFileObjectFromPath from "../../utils/createFileObjectFromPath";

import BreadCrumbs from "../../components/breadcrubs"
import FormCard from "../../components/formCard"
import FormUploadArea from "../../components/fileUpload"
import CustomAutoComplete from "../../components/autoComplete"
import CustomDatePicker from "../../components/datePicker"

import { DurationList, LanguageList, LevelList, SkillsList, SubjectList, TypeList } from "../../data"

import courseStyles from "../../styles/course.module.css"
import { Close } from "@mui/icons-material";

const CoursePage = () => {
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [customCrumb, setCustomCrumb] = useState('');
    const [desc, setDesc] = useState('');
    const [subject, setSubject] = useState(null);
    const [skills, setSkills] = useState([]);
    const [language, setLanguage] = useState('English');
    const [type, setType] = useState('Course');
    const [level, setLevel] = useState('Beginner');
    const [duration, setDuration] = useState('Less Than 2 Hours');
    const [startDate, setStartDate] = useState(null);
    const [price, setPrice] = useState(0);

    const [titleError, setTitleError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [subjectError, setSubjectError] = useState(false);
    const [languageError, setLanguageError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [levelError, setLevelError] = useState(false);
    const [durationError, setDurationError] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [priceError, setPriceError] = useState(false);

    const { id } = useParams()
    const navigate = useNavigate();

    const onSelect = (files) =>{
        setFiles(files);
    }

    const handleSubmit = async() => {
        try {

            if(!title) setTitleError(true);
            if(!desc) setDescError(true);
            if(!subject) setSubjectError(true);
            if(!language) setLanguageError(true);
            if(!type) setTypeError(true);
            if(!level) setLevelError(true);
            if(!duration) setDurationError(true);
            if(!startDate) setStartDateError(true);
            if(price < 0 || price == null) setPriceError(true);

            
            if(titleError || descError || subjectError || languageError || typeError || levelError || durationError || startDateError || priceError){
                throw new Error('Please fill all the required fields');
            }
            
            let start = dayjs(startDate).add(1, 'day').toDate().toISOString().split('T')[0]
            
            const formData = new FormData();
            formData.append('name', title);
            formData.append('desc', desc);
            formData.append('subject', subject);
            formData.append('language', language);
            formData.append('type', type);
            formData.append('level', level);
            formData.append('duration', duration);
            formData.append('skills', skills);
            formData.append('start_date', start);
            formData.append('price', price);
            formData.append('thumbnail', files[0]);

            let res;
            if(id){
                formData.append('course_id', id);
                res = await courseApi.put(`/course/update/`, formData);
            }else{
                res = await courseApi.post("/course/create", formData);
            }

            toast.success(res.data.message);
            setCustomCrumb(title)
            navigate(`/instructor/courses/${res.data?.payload?.course_id || id}`)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const fetchCourse = async() => {
        try {
            let {data} = await courseApi.get(`/course/one/${id}`);

            setTitle(data.payload.name);
            setCustomCrumb(data.payload.name)
            setDesc(data.payload.desc);
            setSubject(data.payload.subject);  
            setLanguage(data.payload.language);
            setType(data.payload.type);
            setLevel(data.payload.level);
            setDuration(data.payload.duration);
            setSkills(data.payload.skills);
            setStartDate(dayjs(data.payload.start_date));
            setPrice(data.payload.price);

            if(data.payload.thumbnail) {
                let file = await createFileObjectFromPath(data.payload.thumbnail);
                setFiles(file);
            }

            toast.success(data.message);

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if(id){
            fetchCourse()
        }
    }, [])
    

    return (
        <>
            <div style={{width:'100%', padding:'20px', display:'flex', flexDirection:'column'}}>
                <BreadCrumbs customLast={true} customCrumb={customCrumb} />
                <FormCard title={"Course"} action={id ? "Update" : "Create"} onClick={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            { files.length > 0 ?
                            <div style={{width:'100%', display:'flex', justifyContent:'center'}} className={courseStyles.imgDiv} onClick={() => setFiles([])}>
                                <img src = {(files[0].objectURL)} className={courseStyles.img}  width={'85%'}/>
                                <Close className={courseStyles.imgCloseIcon}/>
                            </div>
                            :
                            <FormUploadArea 
                                multiple={false}
                                accept={"image/*"}
                                maxFileSize={1000000}
                                label={"Course Thumbnail"}
                                selectfunc={onSelect}
                            />
                            }
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={12}>
                                    <TextField 
                                        variant="outlined" size="small" 
                                        label="Title" placeholder="Title" 
                                        fullWidth
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value)

                                            if(!e.target.value) setTitleError(true);
                                            else setTitleError(false);
                                        }}
                                    />
                                    <Typography variant="caption" display={titleError ? 'block' : 'none'} color={"red"} gutterBottom>
                                        *{"Title is required"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <TextField 
                                        variant="outlined" size="small" 
                                        label="Description" placeholder="Description" 
                                        fullWidth 
                                        multiline 
                                        minRows={2}
                                        value={desc}
                                        onChange={(e) => {
                                            setDesc(e.target.value)
                                            
                                            if(!e.target.value) setDescError(true);
                                            else setDescError(false);
                                        }}
                                    />
                                    <Typography variant="caption" display={descError ? 'block' : 'none'} color={"red"} gutterBottom>
                                        *{"Description is required"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <CustomAutoComplete
                                        multiple={true}
                                        label={"Benefits"}
                                        options={SkillsList}
                                        value={skills}
                                        setValue={setSkills}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomAutoComplete
                                        label={"Subject"}
                                        options={SubjectList}
                                        value={subject}
                                        setValue={setSubject}
                                        errorMsg={"Subject is required"}
                                        isError={subjectError}
                                        setError={setSubjectError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomAutoComplete
                                        label={"Language"}
                                        options={LanguageList}
                                        value={language}
                                        setValue={setLanguage}
                                        errorMsg={"Language is required"}
                                        isError={languageError}
                                        setError={setLanguageError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomAutoComplete
                                        label={"Type"}
                                        options={TypeList}
                                        value={type}
                                        setValue={setType}
                                        errorMsg={"Type is required"}
                                        isError={typeError}
                                        setError={setTypeError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomAutoComplete
                                        label={"Level"}
                                        options={LevelList}
                                        value={level}
                                        setValue={setLevel}
                                        errorMsg={"Level is required"}
                                        isError={levelError}
                                        setError={setLevelError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomAutoComplete
                                        label={"Duration"}
                                        options={DurationList}
                                        value={duration}
                                        setValue={setDuration}
                                        errorMsg={"Duration is required"}
                                        isError={durationError}
                                        setError={setDurationError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <CustomDatePicker
                                        label="Start Date"
                                        disablePast={true}
                                        value={startDate}
                                        setValue={setStartDate}
                                        errorMsg={"Start Date is required"}
                                        isError={startDateError}
                                        setError={setStartDateError}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Price</InputLabel>
                                        <OutlinedInput
                                            size="small"
                                            type="number"
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            label="Price"
                                            placeholder="Price"
                                            value={price}
                                            onChange={(e) => {
                                                setPrice(e.target.value)

                                                if(!e.target.value || e.target.value < 0) setPriceError(true);
                                                else setPriceError(false);
                                            }}
                                        />
                                        <Typography variant="caption" display={priceError ? 'block' : 'none'} color={"red"} gutterBottom>
                                            *{"Valid Price is required"}
                                        </Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormCard>
            </div>
        </>
    )
}

export default CoursePage;
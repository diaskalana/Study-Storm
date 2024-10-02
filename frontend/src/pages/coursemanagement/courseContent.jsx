import { useNavigate, useParams } from "react-router-dom";
import BreadCrumbs from "../../components/breadcrubs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authApi, courseApi, learnerApi } from "../../utils/api";
import dayjs from "dayjs";
import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Switch, Tab, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { Add, AddCircleOutline, Close, Delete, Edit, ExpandMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import FormUploadArea from "../../components/fileUpload";
import { FileIconList } from "../../data";
import CourseContentStyles from '../../styles/courseContent.module.css'
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import CustomProgresssBar from "../../components/customProgressBar";

const CourseContentPage = () => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [thumbnail, setThumbnail] = useState('');
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
    const [approved, setApproved] = useState(false);
    const [contType, setContType] = useState('file')

    const [editable, setEditable] = useState(false);
    const [approvable, setApprovable] = useState(false);
    const [approveAction, setApproveAction] = useState(false);
    
    const [contentId, setContentId] = useState('');
    const [detailId, setDetailId] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [showDialog2, setShowDialog2] = useState(false);
    const [showDialog3, setShowDialog3] = useState(false);
    const [showDialog4, setShowDialog4] = useState(false);
    const [showDialog5, setShowDialog5] = useState(false);
    const [showDialog6, setShowDialog6] = useState(false);

    const [courseContents, setCourseContents] = useState([]);
    const [contentTitle, setContentTitle] = useState('');
    const [contentSubTitle, setContentSubTitle] = useState('');
    const [contentDesc, setContentDesc] = useState('');
    const [contentTitleError, setContentTitleError] = useState(false);

    const [courseContentDetails, setCourseContentDetails] = useState([]);
    const [contentDetailTitle, setContentDetailTitle] = useState('');
    const [contentDetailDesc, setContentDetailDesc] = useState('');
    const [attatchment, setAttatchment] = useState('');
    const [attatchmentType, setAttatchmentType] = useState('');
    const [contentDetailTitleError, setContentDetailTitleError] = useState(false);
    const [contentDetailAttatchmentError, setContentDetailAttatchmentError] = useState(false);

    const [detailSrc, setDetailSrc] = useState('');

    const [tab, setTab] = useState('content');
    const [totalContent, setTotalContent] = useState(0);
    const [rows, setRows] = useState([]);
    
    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 50 
        },
        { 
            field: 'firstName', 
            headerName: 'First Name', 
            width: 150 
        },
        { 
            field: 'lastName', 
            headerName: 'Last Name', 
            width: 150 
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            width: 250 
        },
        { 
            field: 'phoneNumber', 
            headerName: 'Phone No', 
            width: 120 
        },
        { 
            field: 'completedProgres', 
            headerName: 'Progress', 
            width: 120,
            renderCell: ({formattedValue}) => (<CustomProgresssBar value={(formattedValue/totalContent)*100} />)
        },
    ]

    const { id } = useParams()
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);    

    const fetchCourse = async() => {
        try {
            setIsLoading(true);
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
            setApproved(data.payload.approved);
            setThumbnail(data.payload.thumbnail);

            await fetchCourseContents()
            // toast.success(data.message);

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const promptApprove = (status) => {
        setApproveAction(status);
        setShowDialog4(true)
    }

    const approve = async() => {
        try {
            setIsLoading(true);
            let {data} = await courseApi.patch(`/course/approve/${id}/${approveAction}`);
            
            toast.success(data.message);
            navigate('/admin/courses')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCourseLearners = async() => {
        try {
            setIsLoading2(true);
            let {data} = await learnerApi.get(`enrollment/usersByCourse/${id}`);

            let learners = [];
            let emails = data.userEmails;
            let email, firstName, lastName, phoneNumber, completedProgres, learner;
            for (let i = 0; i < emails.length; i++) {
                email = emails[i];


                try {
                    let {data:userData} = await authApi.get(`/v1/user/${email}`);
                    firstName = userData.firstName
                    lastName = userData.lastName
                    phoneNumber = userData.phoneNumber
                } catch (error) {
                    console.log(error.message);
                    continue;
                }

                try {
                    let {data:progresData} = await learnerApi.get(`progress/tracking/${email}/${id}`);
                    completedProgres = progresData?.progress?.pdfIds?.length || 0;
                } catch (error) {
                    console.log(error.message);
                }

                learner = {
                    id: i+1,
                    email,
                    firstName,
                    lastName,
                    phoneNumber,
                    completedProgres
                }

                console.log(completedProgres);
                learners.push(learner);              
                
            }

            setRows(learners);
            // toast.success(data.message);
        } catch (error) {
            setRows([]);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading2(false);
        }
    }

    const fetchCourseContents = async(page = 1, rows = 50) => {
        try {
            setIsLoading(true);
            let {data} = await courseApi.get(`/course/content/all`, {params: {page, rows, course_id: id}});

            setCourseContents(data.payload.rows);

            let details = {}
            let contentLength = 0;
            let content_id;
            let detailData;
            if(data.payload.rows){
                for(let i = 0; i < data.payload.rows.length; i++){
                    content_id = data.payload.rows[i].content_id;
                    detailData = await fetchCourseContentDetails(content_id);
                    contentLength += (detailData?.length || 0)
                    details[content_id] = detailData
                }
            }
            setCourseContentDetails(details)
            setTotalContent(contentLength)

            // toast.success(data.message);
        } catch (error) {
            setCourseContents([]);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCourseContentDetails = async(content_id, page = 1, rows = 50) => {
        try {
            setIsLoading(true);
            let {data} = await courseApi.get(`/course/content/detail/all`, {params: {page, rows, content_id}});
            
            return (data.payload.rows);
            // toast.success(data.message);
        } catch (error) {
            return ([]);
            // toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const promptContentDialog = (content) => {
        if(content){
            setContentId(content.content_id)
            setContentTitle(content.title)
            setContentSubTitle(content.subtitle)
            setContentDesc(content.desc)
        }else{
            setContentId('')
            setContentTitle('')
            setContentSubTitle('')
            setContentDesc('')
        }
        setShowDialog(true);
    }

    const handleContentSubmit = async() => {
        try {

            if(!contentTitle) setContentTitleError(true);

            
            if(contentTitleError){
                throw new Error('Content Title is required');
            }
            
            let data = {
                course_id: id,
                title: contentTitle,
                subtitle: contentSubTitle,
                desc: contentDesc
            }

            let res;
            if(contentId){
                data = {...data, content_id: contentId}
                res = await courseApi.put(`/course/content/update/`, data);
            }else{
                res = await courseApi.post("/course/content/create", data);
            }

            await fetchCourseContents()
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setContentId('')
            setContentTitle('')
            setContentSubTitle('')
            setContentDesc('')
            setShowDialog(false)
        }
    }

    const onSelect = (files) => {
        setAttatchment(files[0]);
        setAttatchmentType(files.map((file) => file.name.split('.').pop()));
    }

    const promptContentDetailDialog = (id) => {
        setContentId(id)
        console.log(id);
        setContentDetailTitle('')
        setContentDetailDesc('')
        setAttatchmentType('')
        setAttatchment('')
        setShowDialog3(true); 
    }

    const handleContentDetailSubmit = async() => {
        try {

            if(!contentDetailTitle) setContentDetailTitleError(true);

            if(!attatchment) setContentDetailAttatchmentError(true);
            
            if(!contentDetailTitle){
                throw new Error('Content Detail Title is required');
            }
            
            let formData = new FormData()
            formData.append('content_id', contentId)
            formData.append('desc', contentDetailDesc)
            formData.append('title', contentDetailTitle)
            formData.append('attatchment_type', attatchmentType)

            if(contType == 'link'){
                formData.append('link', attatchment)
            }
            else {
                formData.append('attatchment', attatchment)
            }

            console.log(formData);
            let res = await courseApi.post("/course/content/detail/create", formData);
            console.log(res);

            await fetchCourseContents()
            toast.success(res.data.message);
            setShowDialog3(false)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const promptDeleteContent = (course_id) => {
        setContentId(course_id)
        setShowDialog2(true);
    }

    const deleteCourseContent = async() => {
        try {
            setIsLoading(true);
            let {data} = await courseApi.delete(`/course/content/delete/${contentId}`);
            await fetchCourseContents();
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
            setShowDialog2(false);
            setContentId('');
        }
    }

    const promptDeleteFile = (detail_id) => {
        setDetailId(detail_id)
        setShowDialog6(true);
    }

    const deleteCourseContentFile = async() => {
        try {
            setIsLoading(true);
            let {data} = await courseApi.delete(`/course/content/detail/delete/${detailId}`);
            await fetchCourseContents();
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
            setShowDialog6(false);
            setDetailId('');
        }
    }

    const getFileType = (type) => {
        return FileIconList.find(file => type.includes(file.name))?.src || "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
    }

    const handleCourseContentDetailClick = (detail) => {
        let link = detail.attatchment;


        if(detail.attatchment_type == 'link'){
            window.open(link, '_blank')
        }
        else if(detail.attatchment_type == 'pdf'){
            link = import.meta.env.VITE_COURSE_SERVER_URL+ detail.attatchment +'?view=fit'
            setDetailSrc(link); 
            setShowDialog5(true)
        }
        else {
            link = import.meta.env.VITE_COURSE_SERVER_URL+ detail.attatchment
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.download = detail.title;
            anchor.click();
        }
    }

    useEffect(() => {
        fetchCourse()

        if(userInfo.userType == "ROLE_ADMIN"){
            setEditable(false);
            setApprovable(true);
        }
        else if(userInfo.userType == "ROLE_INSTRUCTOR"){
            setEditable(true);
            setApprovable(false);
            fetchCourseLearners()
        }
    }, [])


    return (
        <>
            <div style={{width:'100%', padding:'20px', display:'flex', flexDirection:'column'}}>
                <BreadCrumbs customLast={true} customCrumb={customCrumb} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={0} style={{width:'100%', background: 'transparent', display:'flex', flexDirection:'column', padding:'0px 20px', margin:'0px 0px'}}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3} md={12} lg={3}>
                                        <img src={import.meta.env.VITE_COURSE_SERVER_URL+thumbnail} onError={(event) => { event.target.src = "/default.png" }}  alt={title} style={{width:'100%', height:'auto', maxHeight:'350px', objectFit:'cover', borderRadius:'5px'}} />
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={12} lg={9}>
                                        <Grid container spacing={2} height={'100%'}>
                                            {
                                                editable &&
                                                <Grid item xs={12} sm={12} md={12} lg={12} textAlign={'right'}>
                                                    <IconButton onClick={() => navigate(`../courses/update/${id}`)} >
                                                        <Edit />
                                                    </IconButton>
                                                </Grid>
                                            }
                                            <Grid item xs={12} sm={12} md={12} lg={12}>        
                                                <Typography fontSize={25}>{title}</Typography>
                                                <p>{desc}</p>
                                                <p>Start Date: {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                <br />
                                                <Typography fontSize={17}>{price == 0 ? 'FREE' : `$${price}`}</Typography>
                                                <Typography fontSize={15}>{level} • {type} • {duration}</Typography>
                                            </Grid>
                                            {
                                                approvable && approved == null &&
                                                <Grid item xs={12} sm={12} md={12} lg={12} textAlign={'right'} display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'}>
                                                    <Button variant="contained" color="success" onClick={() => promptApprove(true)}>Approve</Button>
                                                    &nbsp;
                                                    &nbsp;
                                                    &nbsp;
                                                    <Button variant="contained" color="error" onClick={() => promptApprove(false)}>Reject</Button>
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <TabContext value={tab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(e, newVal) => setTab(newVal)}>
                        <Tab label="Content" value="content" />
                        { editable && <Tab label="Learners" value="learners" /> }
                    </TabList>
                    </Box>
                    <TabPanel value="content">
                        <Grid container spacing={2}>
                            {
                                editable &&
                                <Grid item xs={12} sm={12} md={12} lg={12} textAlign={'right'}>
                                    <Button variant={'contained'} color={'primary'} onClick={() => promptContentDialog('')}><Add /></Button>
                                </Grid>
                            }
                            <Grid item xs={12} sm={12} md={12} lg={12} paddingBottom={'10px'}>
                                {courseContents.map((content, index) => (
                                    <Accordion key={index}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography>{content.title}</Typography>
                                            {
                                                editable &&
                                                <>
                                                    <IconButton style={{marginLeft:'5px', height:'25px', width:'25px'}} onClick={() => promptContentDialog(content)}><Edit /></IconButton>
                                                    <IconButton style={{marginLeft:'5px', height:'25px', width:'25px'}} onClick={() => promptDeleteContent(content.content_id)}><Delete fontSize="20px"/></IconButton>
                                                </>
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {content.subtitle && <Typography fontWeight={700} marginBottom={'15px'}>{content.subtitle}</Typography>}
                                            {content.desc &&
                                            <Typography>
                                                {content.desc}
                                            </Typography>
                                            }
                                            <br />
                                            {courseContentDetails[content.content_id]?.map((detail, index) => (
                                                <Grid container key={index} spacing={0} alignItems={'center'} className={CourseContentStyles.fileRow}>
                                                    <Grid item md={.4} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                        <img alt={detail.title} role="presentation" src={getFileType(detail.attatchment_type)} width={25} />
                                                    </Grid>
                                                    <Grid item md={11} style={{cursor:'pointer'}} onClick={() => handleCourseContentDetailClick(detail)}>
                                                        <Typography>{detail.title}</Typography>
                                                    </Grid>
                                                {
                                                    editable &&
                                                    <Grid item md={.6}>
                                                        <IconButton onClick={() => promptDeleteFile(detail.detail_id)}><Delete /> </IconButton>
                                                    </Grid>
                                                }
                                                </Grid>
                                            ))}
                                            {
                                                editable &&
                                                <>
                                                    <Button style={{margin:'5px', padding:'10px'}} onClick={() => promptContentDetailDialog(content.content_id)}><AddCircleOutline /> &nbsp;&nbsp;&nbsp;Add Content</Button>
                                                </>
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Grid>
                        </Grid>
                    </TabPanel>
                    { editable &&
                    <TabPanel value="learners">
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                    pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            
                            disableRowSelectionOnClick
                            loading={isLoading2}

                        />
                    </TabPanel>
                    }
                </TabContext>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            
            <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                maxWidth={'xs'}
                fullWidth
            >
                <DialogTitle>
                    New Course Content Category
                </DialogTitle>
                <DialogContent style={{paddingTop:'5px'}}>
                    <TextField 
                        variant="outlined" size="small" 
                        label="Content Category Title" placeholder="Content Category Title" 
                        fullWidth
                        value={contentTitle}
                        onChange={(e) => {
                            setContentTitle(e.target.value)

                            if(!e.target.value) setContentTitleError(true);
                            else setContentTitleError(false);
                        }}
                    />
                    <Typography variant="caption" display={contentTitleError ? 'block' : 'none'} color={"red"} gutterBottom>
                        *{"Content Category Title is required"}
                    </Typography>
                    <br />
                    <br />
                    <TextField 
                        variant="outlined" size="small" 
                        label="Content Category Sub Title" placeholder="Content Category Sub Title" 
                        fullWidth
                        value={contentSubTitle}
                        onChange={(e) => {
                            setContentSubTitle(e.target.value)
                        }}
                    />
                    <br />
                    <br />
                    <TextField 
                        variant="outlined" size="small" 
                        label="Description" placeholder="Description" 
                        fullWidth 
                        multiline 
                        minRows={2}
                        value={contentDesc}
                        onChange={(e) => {
                            setContentDesc(e.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setShowDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleContentSubmit} autoFocus color="success">
                        {contentId ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                open={showDialog2}
                onClose={() => setShowDialog2(false)}
            >
                <DialogTitle>
                    Are you sure you want to delete this course content?
                </DialogTitle>
                <DialogActions>
                <Button autoFocus onClick={() => setShowDialog2(false)}>
                    Cancel
                </Button>
                <Button onClick={deleteCourseContent} autoFocus color="error">
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                open={showDialog3}
                onClose={() => setShowDialog3(false)}
                maxWidth={'md'}
                fullWidth
            >
                <DialogTitle>
                    New Course Content
                </DialogTitle>
                <DialogContent style={{paddingTop:'5px'}}>
                    <ToggleButtonGroup
                        color="primary"
                        value={contType}
                        exclusive
                        onChange={(e, newVal) => setContType(newVal)}
                    >
                        <ToggleButton value="file">File</ToggleButton>
                        <ToggleButton value="link">Link</ToggleButton>
                    </ToggleButtonGroup>
                    <br />
                    <br />                    
                    <TextField 
                        variant="outlined" size="small" 
                        label="Content Title" placeholder="Content Title" 
                        fullWidth
                        value={contentDetailTitle}
                        onChange={(e) => {
                            setContentDetailTitle(e.target.value)

                            if(!e.target.value) setContentDetailTitleError(true);
                            else setContentDetailTitleError(false);
                        }}
                    />
                    <Typography variant="caption" display={contentDetailTitleError ? 'block' : 'none'} color={"red"} gutterBottom>
                        *{"Content Title is required"}
                    </Typography>
                    <br />
                    <br />
                    <TextField 
                        variant="outlined" size="small" 
                        label="Description" placeholder="Description" 
                        fullWidth 
                        multiline 
                        minRows={2}
                        value={contentDetailDesc}
                        onChange={(e) => {
                            setContentDetailDesc(e.target.value)
                        }}
                    />
                    <br />
                    <br />
                    {contType == 'file' ?
                    <><FormUploadArea 
                        accept="*" 
                        multiple={false} 
                        maxFileSize={1000000000000000}  
                        label={"Files"}
                        selectfunc={onSelect}
                    />
                    <Typography variant="caption" display={contentDetailAttatchmentError ? 'block' : 'none'} color={"red"} gutterBottom>
                        *{"Attatchment is required"}
                    </Typography></>
                    :
                    <><TextField 
                        variant="outlined" size="small" 
                        label="Link" placeholder="Link" 
                        fullWidth
                        value={attatchment}
                        onChange={(e) => {
                            setAttatchment(e.target.value)
                            setAttatchmentType('link')

                            if(!e.target.value) setContentDetailAttatchmentError(true);
                            else setContentDetailAttatchmentError(false);
                        }}
                    />
                    <Typography variant="caption" display={contentDetailAttatchmentError ? 'block' : 'none'} color={"red"} gutterBottom>
                        *{"Link is required"}
                    </Typography></>
                    }
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setShowDialog3(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleContentDetailSubmit} autoFocus color="success">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                open={showDialog4}
                onClose={() => setShowDialog4(false)}
            >
                <DialogTitle>
                    Are you sure you want to {approveAction ? 'approve' : 'reject'} this course?
                </DialogTitle>
                <DialogActions>
                <Button autoFocus onClick={() => setShowDialog4(false)}>
                    Cancel
                </Button>
                <Button onClick={approve} autoFocus color={approveAction ? 'success' : 'error'}>
                    {approveAction ? 'Approve' : 'Reject'}
                </Button>
                </DialogActions>
            </Dialog>
            
            <Dialog
                open={showDialog5}
                onClose={() => setShowDialog5(false)}
                fullScreen
            >
                <DialogTitle textAlign={'right'}>
                    <IconButton onClick={() => setShowDialog5(false)}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <iframe src={detailSrc} onError={() => setShowDialog5(false)} width={'100%'} height={'100%'}/>
                </DialogContent>
                
            </Dialog>
            
            <Dialog
                open={showDialog6}
                onClose={() => setShowDialog6(false)}
            >
                <DialogTitle>
                    Are you sure you want to delete this file?
                </DialogTitle>
                <DialogActions>
                <Button autoFocus onClick={() => setShowDialog6(false)}>
                    Cancel
                </Button>
                <Button onClick={deleteCourseContentFile} autoFocus color="error">
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CourseContentPage;
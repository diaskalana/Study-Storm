import { useNavigate, useParams } from "react-router-dom";
import BreadCrumbs from "../../components/breadcrubs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { courseApi, learnerApi } from "../../utils/api";
import dayjs from "dayjs";
import { Accordion, AccordionDetails, Backdrop, Card, CardContent, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { FileIconList } from "../../data";
import CourseContentStyles from './courseContent.module.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CertificateBackground from '../../../public/LogoBig1.png'; // Import your certificate background image

const CourseContentPage = () => {
    const [isLoading, setIsLoading] = useState(false);
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
    const [showDialog5, setShowDialog5] = useState(false);
    const [completedPDFCount, setCompletedPDFCount] = useState(0); // State to hold completed PDF count
    const [totalContentDetailsCount, setTotalContentDetailsCount] = useState(0); // State to hold total content details count
    const [completedDetails, setCompletedDetails] = useState([]); // State to hold completed content details

    const [courseContents, setCourseContents] = useState([]);
    const [courseContentDetails, setCourseContentDetails] = useState([]);
    const [detailSrc, setDetailSrc] = useState('');
    const [showCertificateButton, setShowCertificateButton] = useState(false);

    const { id } = useParams();
    const userInfo = useSelector((state) => state.auth.userInfo);

    const fetchCourse = async () => {
        try {
            setIsLoading(true);
            let { data } = await courseApi.get(`/course/one/${id}`);

            setTitle(data.payload.name);
            setCustomCrumb(data.payload.name);
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

            await fetchCourseContents();
            await fetchProgress(); // Fetch progress after fetching course details
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCourseContents = async (page = 1, rows = 50) => {
        try {
            setIsLoading(true);
            let { data } = await courseApi.get(`/course/content/all`, { params: { page, rows, course_id: id } });

            setCourseContents(data.payload.rows);

            let details = {};
            let totalDetailsCount = 0; // Initialize total details count
            if (data.payload.rows) {
                for (let i = 0; i < data.payload.rows.length; i++) {
                    const content_id = data.payload.rows[i].content_id;
                    const detailData = await fetchCourseContentDetails(content_id);
                    details[content_id] = detailData;
                    totalDetailsCount += detailData.length; // Accumulate the count of details
                }
            }
            setCourseContentDetails(details);
            setTotalContentDetailsCount(totalDetailsCount); // Set the total content details count
        } catch (error) {
            setCourseContents([]);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCourseContentDetails = async (content_id, page = 1, rows = 50) => {
        try {
            setIsLoading(true);
            let { data } = await courseApi.get(`/course/content/detail/all`, { params: { page, rows, content_id } });

            return data.payload.rows;
        } catch (error) {
            return [];
        } finally {
            setIsLoading(false);
        }
    }

    const fetchProgress = async () => {
        try {
            setIsLoading(true);
            const response = await learnerApi.get(`/progress/tracking/${userInfo.email}/${id}`);
            const { progress } = response.data;
            if (progress && progress.pdfIds) {
                setCompletedPDFCount(progress.pdfIds.length); // Set the completed PDF count

                // Fetch content details for completed PDFs
                const completedContentDetails = [];
                for (const pdfId of progress.pdfIds) {
                    const { data } = await courseApi.get(`/course/content/detail/all`, { params: { pdf_id: pdfId } });
                    completedContentDetails.push(...data.payload.rows.map(detail => detail.detail_id));
                }
                setCompletedDetails(completedContentDetails);
            }
        } catch (error) {
            toast.error('Error fetching progress. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const getFileType = (type) => {
        return FileIconList.find(file => type.includes(file.name))?.src || "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png";
    }

    const handleCourseContentDetailClick = async (detail) => {
        let link = detail.attatchment;

        const checkbox = document.querySelector(`input[name="content_${detail.detail_id}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }

        try {
            const payload = {
                courseId: id,
                userEmail: userInfo.email,
                pdfIds: [detail.detail_id] // Wrap detail_id in an array
            };

            const response = await learnerApi.post('/progress/tracking', payload);

            if (completedPDFCount + 1 === totalContentDetailsCount) {
                setShowCertificateButton(true);
            }
        } catch (error) {
            toast.error('Error tracking progress. Please try again later.');
        }

        if (detail.attatchment_type === 'link') {
            window.open(link, '_blank');
        } else if (detail.attatchment_type === 'pdf') {
            link = import.meta.env.VITE_COURSE_SERVER_URL + detail.attatchment + '?view=fit';
            setDetailSrc(link);
            setShowDialog5(true);
        } else {
            link = import.meta.env.VITE_COURSE_SERVER_URL + detail.attatchment;
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.download = detail.title;
            anchor.click();
        }
    }
    
    const generateCertificate = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800; 
        canvas.height =800;
        const ctx = canvas.getContext('2d');
    
        // Set white background
        ctx.fillStyle = '#ffffff'; // White color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Add logo at the top-middle
        const logo = new Image();
        logo.src = '/LogoBig1.png';
        logo.onload = () => {
            const logoWidth = 200;
            const logoHeight = 100; 
            const logoX = (canvas.width - logoWidth) / 2;
            const logoY = 150; 
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    
            // Add certificate text
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = '#000000'; 
            ctx.textAlign = 'center';
            ctx.fillText('Certificate of Completion', canvas.width / 2, 300);
    
            ctx.font = '24px Arial';
            ctx.fillText(`This certifies that ${userInfo.displayName} has completed`, canvas.width / 2, 400);
            ctx.fillText(`the course ${title} with distinction.`, canvas.width / 2, 450);
            ctx.fillText(`Issued on ${dayjs().format('MMMM DD, YYYY')}`, canvas.width / 2, 500);
    
            // Additional text for a more elaborate certificate
            ctx.font = 'italic 20px Arial';
            ctx.fillText(`In recognition of outstanding dedication to learning`, canvas.width / 2, 550);
            ctx.fillText(`and commitment to personal development.`, canvas.width / 2, 580);
            ctx.fillText(`Presented by Study Storm`, canvas.width / 2, 630);
    
            // Convert canvas to data URL and download
            const dataUrl = canvas.toDataURL();
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${title}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    };
    
    useEffect(() => {
        fetchCourse();
    }, []);

    // Calculate the percentage of completed PDFs
    const completedPercentage = totalContentDetailsCount === 0 ? 0 : Math.round((completedPDFCount / totalContentDetailsCount) * 100);

    const handleDownloadCertificate = () => {
        generateCertificate();
    };

    return (
        <>
            <div style={{ width: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <BreadCrumbs customLast={true} customCrumb={customCrumb} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={0} style={{ width: '100%', background: 'transparent', display: 'flex', flexDirection: 'column', padding: '0px 20px', margin: '0px 0px' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3} md={12} lg={3}>
                                        <img src={import.meta.env.VITE_COURSE_SERVER_URL + thumbnail} onError={(event) => { event.target.src = "/default.png" }} alt={title} style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'cover', borderRadius: '5px' }} />
                                    </Grid>
                                    <Grid item xs={12} sm={9} md={12} lg={9}>
                                        <Grid container spacing={2} height={'100%'}>
                                            <Grid item xs={12} sm={9} md={12} lg={9}>
                                                <Grid container spacing={2} height={'100%'}>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <Typography fontSize={25}>{title}</Typography>
                                                        <p>{desc}</p>
                                                        <p>Start Date: {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                        <br />
                                                        <Typography fontSize={17}>{price == 0 ? 'FREE' : `$${price}`}</Typography>
                                                        <Typography fontSize={15}>{level} • {type} • {duration}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={12} lg={3} justifyContent="flex-end">
                                                <Card elevation={3} style={{ padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
                                                    <Typography variant="h6" align="center" padding={2}>Progress</Typography>
                                                    <div style={{ width: 100, height: 100, margin: 'auto' }}>
                                                        <CircularProgressbar value={completedPercentage} text={`${completedPercentage}%`} />
                                                    </div>
                                                    <Typography align="center" padding={2}>Completed: {completedPDFCount}   out of {totalContentDetailsCount}</Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} paddingBottom={'10px'}>
                        {courseContents.map((content, index) => (
                            <Accordion key={index}>
                                <AccordionDetails>
                                    <br />
                                    {courseContentDetails[content.content_id]?.map((detail, index) => (
                                        <Grid container key={index} spacing={0} alignItems={'center'} className={`${CourseContentStyles.fileRow} ${completedDetails.includes(detail.detail_id) ? CourseContentStyles.completedTask : ''}`}>
                                            <Grid item md={.4} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <input type="checkbox" name={`content_${detail.detail_id}`} defaultChecked={completedDetails.includes(detail.detail_id)} />
                                            </Grid>
                                            <Grid item md={.4} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <img alt={detail.title} role="presentation" src={getFileType(detail.attatchment_type)} width={25} />
                                            </Grid>
                                            <Grid item md={11} style={{ cursor: 'pointer' }} onClick={() => handleCourseContentDetailClick(detail)}>
                                                <Typography>{detail.title}</Typography>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                    {completedPercentage === 100 && (
                        <Grid item xs={12} textAlign="center">
                            <Button variant="contained" color="primary" onClick={handleDownloadCertificate}>
                                Download Certificate
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={showDialog5}
                onClose={() => setShowDialog5(false)}
                fullScreen
            >
                <DialogTitle textAlign={'right'}>
                    <IconButton onClick={() => setShowDialog5(false)}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <iframe src={detailSrc} onError={() => setShowDialog5(false)} width={'100%'} height={'100%'} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CourseContentPage;

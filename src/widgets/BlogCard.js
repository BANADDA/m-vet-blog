import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import React from 'react';

const BlogCard = ({ imageUrl, title, createdAt, caption, onView, onEdit, onDelete }) => {
    const date = createdAt instanceof Date ? createdAt : createdAt.toDate();
  
    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia
                sx={{ height: 140 }}
                image={imageUrl}
                title={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {caption}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onView}>View</Button>
                {/* <Button size="small" onClick={onEdit}>Edit</Button> */}
                <Button size="small" onClick={onDelete}>Delete</Button>
            </CardActions>
        </Card>
    );
};

export default BlogCard;

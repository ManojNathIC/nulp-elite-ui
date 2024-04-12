import React, { useState, useEffect }  from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Divider } from "native-base";
import RandomImage from "../assets/cardRandomImgs.json"


export default function BoxCard({ items, index ,onClick}) {
  const [imgUrl, setImgUrl] = React.useState(true);
  useEffect(() => { 
    // const random = getRandomValue();
    randomImg(index);
 }, []);
const randomImg = (i) => {
console.log("RandomImage--- ",i,"   ", i % 10 || 10); 
setImgUrl(RandomImage.ImagePaths[i % 10 || 10]);
console.log("imgUrl--- ", RandomImage.ImagePaths[i % 10 || 10]);
}
// // Assuming 'data' is your JSON array
// const randomItem = getRandomValue(data);
//   // console.log(items.appIcon)
//    // Function to select a random value from an array
//  const getRandomValue = (array) => {
//   console.log("RandomImage   --  ",RandomImage.ImagePaths )
//   const randomIndex= RandomImage;
//   // const randomIndex = Math.floor(Math.random() * RandomImage..length);
//   console.log("randomIndex",randomIndex)

//   // return array[randomIndex];
//   return randomIndex;
// };


  return (
    <Card sx={{  position: "relative" }}>
      <CardMedia
        sx={{
          height: 140,
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          position: "relative",
          background:
            "linear-gradient(45deg, RGBA(28, 25, 25, 0.46) 7%, RGBA(20, 18, 18, 0.57) 45%)",
        }}
        image={require("../assets/card-bg.png")}
        title="green iguana"
      />
      <div 
      onClick={onClick}
      style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right:'0',
    width: '100%',
    height: '47%',
    background: 'linear-gradient(45deg, RGBA(28, 25, 25, 0.46) 7%, RGBA(20, 18, 18, 0.57) 45%)',
    zIndex: 999,
    margin: '0',
    borderTopLeftRadius: '5px',
    borderTopRightRadius:'20px'
  }}></div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" className="cardTitle" style={{fontSize:'14px',fontWeight:'600'}}>
           {items.name}
        </Typography>
        <Typography gutterBottom variant="h7" component="div" style={{zIndex:'999',fontSize:'14px',position:'absolute',top:'30px',right:'3px',color:'#fff',textAlign:'center'}}>
                  <Box className="cardCourses"> {items.primaryCategory}</Box>
                  </Typography>
        <Box style={{background:'#fff',padding:'10px',borderRadius:'150px',height:'50px',width:'50px',border:'solid 1px #E1E1E1',position:'absolute',top:'115px',right:'30px',textAlign:'center',zIndex:'999'}}>
          <img src={items.appIcon ? items.appIcon : require("assets/swm.png")} style={{height:'50px',maxWidth:'100%',objectFit:'contain'}} />

          </Box>

        <Typography
          variant="body2"
          color="#5B5B5B"
          style={{ fontSize: "11px", padding: "20px 0", textAlign: "left" }}
        >
          Engineering Staff College India
        </Typography>
        <Divider></Divider>
      </CardContent>
      <CardActions style={{paddingBottom:'20px', height:'30px'}}>
      {items.board ? (


        <Button size="small" style={{background: '#F4D46261',color:'#484848',fontSize:'10px'}}> {items.board}</Button>
        ) : null}
        {items.gradeLevel ? (


        <Button size="small" style={{background: '#F4D46261',color:'#484848',fontSize:'10px'}}> {items.gradeLevel}</Button>
        ) : null}

      </CardActions>
    </Card>
  );
}

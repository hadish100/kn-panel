const gbOrTb = (num) => {

    if(num<1000) return num + " GB";
    else 
    {
        let gb = num/1000;
        return gb.toFixed(2) + " TB";
    }
 
};

export default gbOrTb
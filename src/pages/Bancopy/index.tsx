import React, { useState, useEffect,  } from 'react';
import { Carousel, Image } from 'antd';
import styles from './index.less';
import lunbo1 from '@/assets/banner/lunbo1.jpg';
import lunbo2 from '@/assets/banner/lunbo2.jpeg';
import lunbo3 from '@/assets/banner/lunbo3.jpg';
import lunbo4 from '@/assets/banner/lunbo4.png';
import lunbo5 from '@/assets/banner/lunbo5.png';
import lunbo6 from '@/assets/banner/lunbo6.png';

const banArr = [lunbo5, lunbo6, lunbo1, lunbo2, lunbo3, lunbo4];

const Ban = () => {
  return (
    <div style={{ width: 700 }}>
      <Carousel autoplay >
        {banArr.map((item, idx) => (
          <Image preview={false} src={item} key={idx} className={styles.imgs} />
        ))}
      </Carousel>
    </div>
  );
};
export default Ban;

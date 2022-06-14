import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Image } from 'antd';
import styles from './index.less';
import lunbo1 from '@/assets/banner/lunbo1.jpg';
import lunbo2 from '@/assets/banner/lunbo2.jpeg';
import lunbo3 from '@/assets/banner/lunbo3.jpg';
import lunbo4 from '@/assets/banner/lunbo4.png';
import lunbo5 from '@/assets/banner/lunbo5.png';
import lunbo6 from '@/assets/banner/lunbo6.png';

const banArr = [lunbo5, lunbo6, lunbo1, lunbo2, lunbo3, lunbo4];
const Banner = (props) => {
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [imgList, setImgList] = useState<number>();
  const [showArrow, setShowArrow] = useState<string>('none');
  const [transition, setTransition] = useState<string>('0.5s ease');
  const [throttling, setThrottling] = useState<boolean>(true);
  let [index, setindex] = useState<number>(0);
  let [into, setInto] = useState<NodeJS.Timer>();
  const imgRef = useRef(null);
  const dotRef = useRef(null);
  useEffect(() => {
    const dom = imgRef.current;
    const cloneChild = dom.firstElementChild.cloneNode(true);
    dom.appendChild(cloneChild);
    setImgList(dom.children.length - 1);
    // dom.removeChild(cloneChild);
  }, []);

  useEffect(() => {
    //绑定小圆点
    const dotDom = dotRef.current.children;
    dotDom.forEach((item, idx) => {
      if (index === idx) {
        dotDom[idx].classList.add(styles.active);
      } else {
        dotDom[idx].classList.remove(styles.active);
      }
    });
  }, [index]);

  useEffect(() => {
    // 自动轮播
    const times = setInterval(() => {
      if (index === 6) {
        index = 0;
        setImgWidth(0);
      }
      clikRight();
    }, 2000);
    setInto(times);
    return () => {
      clearInterval(times);
    };
  }, []);

  const clikLeft = () => {
    if (throttling === false) return;
    setindex(--index);
    if (index === -1) {
      setTransition('none');
      setImgWidth(imgList * -700);
      setTimeout(() => {
        setindex(banArr.length - 1);
        setImgWidth((banArr.length - 1) * -700);
        setTransition('0.5s ease');
      }, 0);
    } else {
      setImgWidth(index * -700);
    }
    //节流
    setThrottling(false);
    setTimeout(() => {
      setThrottling(true);
    }, 800);
  };
  const clikRight = () => {
    if (throttling === false) return;
    setTransition('0.5s ease');
    setindex(++index);
    setImgWidth(index * -700);
    if (index === 6) {
      setTimeout(() => {
        setTransition('none');
        setindex(0);
        setImgWidth(0);
      }, 1000);
    }
    //节流
    setThrottling(false);
    setTimeout(() => {
      setThrottling(true);
    }, 800);
  };
  //鼠标移入
  const handelMouseEnter = () => {
    setShowArrow('block');
    clearInterval(into);
  };
  //鼠标移出
  const handeMouseLeave = () => {
    setShowArrow('none');
    const times = setInterval(() => {
      if (index === 6) {
        index = 0;
        setImgWidth(0);
      }
      clikRight();
    }, 2000);
    setInto(times);
  };
  return (
    <div className={styles.bgcs}>
      <div className={styles.warp}>
        <div
          className={styles.banner}
          style={{ left: imgWidth, transition: transition }}
          onMouseEnter={handelMouseEnter}
          onMouseLeave={handeMouseLeave}
          ref={imgRef}
        >
          {banArr.map((item, idx) => {
            return <Image key={idx} src={item} preview={false} className={styles.imgs} />;
          })}
        </div>
        <a
          className={styles.left}
          onClick={clikLeft}
          style={{ display: showArrow }}
          onMouseEnter={() => setShowArrow('block')}
        >
          &lt;
        </a>
        <a
          className={styles.right}
          onClick={clikRight}
          style={{ display: showArrow }}
          onMouseEnter={() => setShowArrow('block')}
        >
          &gt;
        </a>
        <ul className={styles.imgBottom} ref={dotRef}>
          {banArr.map((item, idx) => {
            return (
              <li
                key={idx}
                data-key={idx}
                onClick={(e: any) => {
                  const lidex = Number(e.target.getAttribute('data-key'));
                  setindex(lidex);
                  setImgWidth(lidex * -700);
                }}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Banner;

import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Translate, { translate } from '@docusaurus/Translate';


// =========================================
// 3 个展台的数据源（黄色、蓝色、绿色主题）
// =========================================
const getShowcaseSections = () => [
  // 第 1 组 (左图右文)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s1.item1.title',
          message: '打造专属外观',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item1.desc',
          message: '随心所欲定制主题色彩、深浅模式及布局细节，让文档站点精准贴合品牌调性。',
        }),
        image: '/img/image_left.png',
        bgColor: '#fbbc04',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item2.title',
          message: '智能扩展与模块化',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item2.desc',
          message: '支持通过插件与 Hook 灵活扩展功能，从搜索组件到图表集成一应俱全。',
        }),
        image: '/img/image_center.png',
        bgColor: '#f9ab00',
      },
      {
        title: translate({
          id: 'homepage.showcase.s1.item3.title',
          message: '灵活的多页面路由',
        }),
        desc: translate({
          id: 'homepage.showcase.s1.item3.desc',
          message: '全自动化的路由解析机制，让知识库管理、博客写作和产品发布顺畅无阻。',
        }),
        image: '/img/image_right.png',
        bgColor: '#e37400',
      },
    ],
  },

  // 第 2 组 (左文右图 - reverse)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s2.item1.title',
          message: '跨设备无缝浏览与同步',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item1.desc',
          message: '在任意设备上登录账户，即可访问已保存的阅读进度、书签与配置，一切尽在掌握。',
        }),
        image: '/img/image_center.png',
        bgColor: '#4285f4',
      },
      {
        title: translate({
          id: 'homepage.showcase.s2.item2.title',
          message: '自动填充与密码管理',
        }),
        desc: translate({
          id: 'homepage.showcase.s2.item2.desc',
          message: '借助现代化安全策略，自动同步你的配置，节省重复输入的繁琐时间。',
        }),
        image: '/img/image_right.png',
        bgColor: '#1a73e8',
      },
    ],
  },

  // 第 3 组 (左图右文)
  {
    items: [
      {
        title: translate({
          id: 'homepage.showcase.s3.item1.title',
          message: '借助静态优化，节省宝贵时间',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item1.desc',
          message: '极速预渲染与资源压缩优化，为用户呈现秒级加载的极致阅读体验。',
        }),
        image: '/img/image_right.png',
        bgColor: '#34a853',
      },
      {
        title: translate({
          id: 'homepage.showcase.s3.item2.title',
          message: '内置隐私与内容防护',
        }),
        desc: translate({
          id: 'homepage.showcase.s3.item2.desc',
          message: '全面隔离外部脚本风险，默认开启严格的 CSP 安全策略与隐私沙盒。',
        }),
        image: '/img/image_left.png',
        bgColor: '#1e8e3e',
      },
    ],
  },
];

// =========================================
// 拟态浏览器视窗组件 (顶部画廊使用)
// =========================================
function BrowserWindow({ title, isActive, isDark, onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{ cursor: isActive ? 'default' : 'pointer' }}
      className={clsx(
        styles.browserCard,
        isActive ? styles.activeCard : styles.inactiveCard,
        isDark && styles.darkWindow
      )}>
      <div className={styles.browserHeader}>
        <div className={styles.windowControls}>
          <span className={clsx(styles.macDot, styles.dotRed)} />
          <span className={clsx(styles.macDot, styles.dotYellow)} />
          <span className={clsx(styles.macDot, styles.dotGreen)} />
        </div>
        <div className={styles.browserTab}>
          <span className={styles.tabIcon}>{isDark ? '💻' : '📄'}</span>
          <span className={styles.tabTitle}>{title}</span>
        </div>
      </div>
      <div className={styles.browserContent}>
        {children}
      </div>
    </div>
  );
}

// =========================================
// 顶部动态焦点画廊组件 (保留原版流畅手感)
// =========================================
function ShowcaseReel() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const activeIndexRef = useRef(1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let targetScroll = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollLeft = targetScroll;

    let isAnimating = false;
    let rafId = null;

    const checkActiveCard = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const progress = el.scrollLeft / maxScroll;
      let nextIndex = 1;

      if (progress < 0.28) {
        nextIndex = 0;
      } else if (progress > 0.72) {
        nextIndex = 2;
      } else {
        nextIndex = 1;
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const updateScroll = () => {
      const current = el.scrollLeft;
      const diff = targetScroll - current;

      if (Math.abs(diff) > 0.5) {
        el.scrollLeft += diff * 0.12;
        checkActiveCard();
        rafId = requestAnimationFrame(updateScroll);
      } else {
        el.scrollLeft = targetScroll;
        checkActiveCard();
        isAnimating = false;
      }
    };

    const handleWheel = (e) => {
      if (e.deltaY === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const isScrollingDown = e.deltaY > 0;

      const isAtRight = targetScroll >= maxScroll - 8;
      const isAtLeft = targetScroll <= 8;

      if ((isScrollingDown && isAtRight) || (!isScrollingDown && isAtLeft)) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        return;
      }

      e.preventDefault();
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY * 1.5));

      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    const handleNativeScroll = () => {
      if (!isAnimating) {
        targetScroll = el.scrollLeft;
        checkActiveCard();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', handleNativeScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToCard = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (index === 0) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (index === 1) {
      el.scrollTo({ left: maxScroll / 2, behavior: 'smooth' });
    } else if (index === 2) {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.showcaseOuterWrapper}>
      <div className={styles.showcaseWrapper} ref={scrollRef}>
        <div className={styles.showcaseTrack}>
          <BrowserWindow
            title="快速上手指南"
            isActive={activeIndex === 0}
            isDark={true}
            onClick={() => scrollToCard(0)}
          >
            <img src="/img/image_left.png" alt="preview 1" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="系统概览主页"
            isActive={activeIndex === 1}
            onClick={() => scrollToCard(1)}
          >
            <img src="/img/image_center.png" alt="preview 2" className={styles.screenImg} />
          </BrowserWindow>

          <BrowserWindow
            title="构建与部署"
            isActive={activeIndex === 2}
            isDark={true}
            onClick={() => scrollToCard(2)}
          >
            <img src="/img/image_right.png" alt="preview 3" className={styles.screenImg} />
          </BrowserWindow>
        </div>
      </div>
    </div>
  );
}

// =========================================
// Google Chrome 风格联动特性展台组件
// =========================================
function InteractiveShowcase({ sectionData, reverse = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = sectionData.items[activeIndex] || sectionData.items[0];

  return (
    <div className={clsx(styles.featureShowcase, reverse && styles.reverse)}>
      {/* 视觉卡片区 */}
      <div
        className={styles.showcaseVisual}
        style={{ backgroundColor: current.bgColor }}
      >
        <div className={styles.visualInner}>
          <img
            src={current.image}
            alt={current.title}
            className={styles.showcaseInnerImg}
          />
        </div>
      </div>

      {/* 文本列表区 */}
      <div className={styles.showcaseContent}>
        {sectionData.items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={idx}
              className={clsx(styles.featureItem, isActive && styles.active)}
              onClick={() => setActiveIndex(idx)}
            >
              <Heading as="h3" className={styles.featureItemTitle}>
                {item.title}
              </Heading>
              {isActive && (
                <p className={styles.featureItemDesc}>
                  {item.desc}
                </p>
              )}
            </div>
          );
        })}

        {sectionData.ctaText && (
          <div className={styles.showcaseCta}>
            <Link className={styles.ctaLink} to={sectionData.ctaLink || '#'}>
              {sectionData.ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================
// 头部 Hero 区域
// =========================================
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>{siteConfig.title}</Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.actionRow}>
          <Link className={clsx('button', styles.pillPrimaryButton)} to="/docs/intro">
            <Translate id="homepage.button.getStarted">立即体验 →</Translate>
          </Link>
          <Link className={clsx('button', styles.pillSecondaryButton)} to="https://github.com">
            GitHub
          </Link>
        </div>
      </div>
      <ShowcaseReel />
    </header>
  );
}

// =========================================
// 页面主入口
// =========================================
export default function Home() {
  const showcaseSections = getShowcaseSections();

  return (
    <Layout>
      <HomepageHeader />
      <main className={styles.mainShowcaseSection}>
        <div className="container">
          <InteractiveShowcase
            sectionData={showcaseSections[0]}
            reverse={false}
          />
          <InteractiveShowcase
            sectionData={showcaseSections[1]}
            reverse={true}
          />
          <InteractiveShowcase
            sectionData={showcaseSections[2]}
            reverse={false}
          />
        </div>
      </main>
    </Layout>
  );
}
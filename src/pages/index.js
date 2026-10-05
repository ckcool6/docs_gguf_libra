import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import styles from './index.module.css';

// 核心特性列表（JSX 支持直接嵌入 <Translate>，便于命令行自动抽取词条）
const FeatureList = [
  {
    title: (
      <Translate id="homepage.feature.outOfBox.title">
        开箱即用
      </Translate>
    ),
    icon: '⚡',
    description: (
      <Translate id="homepage.feature.outOfBox.desc">
        无需繁琐配置，专注内容创作，专为技术文档与知识库打造。
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.feature.markdown.title">
        Markdown 原生支持
      </Translate>
    ),
    icon: '📝',
    description: (
      <Translate id="homepage.feature.markdown.desc">
        全面支持 CommonMark、GFM 与富文本扩展语法，写作如同编写代码。
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.feature.fastBuild.title">
        极速静态构建
      </Translate>
    ),
    icon: '🚀',
    description: (
      <Translate id="homepage.feature.fastBuild.desc">
        依托现代静态站点生成技术，极致的加载性能与优秀的 SEO 表现。
      </Translate>
    ),
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className="container">
        {/* 顶部胶囊徽章 */}
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>
            <Translate id="homepage.badge.version">v1.0.0 发布</Translate>
          </span>
          <span className={styles.badgeText}>
            <Translate id="homepage.badge.text">全新文档系统上线 🎉</Translate>
          </span>
        </div>

        {/* 主标题与副标 */}
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          {siteConfig.tagline}
        </p>

        {/* 操作按钮组 */}
        <div className={styles.actionButtons}>
          <Link
            className={clsx('button', styles.primaryButton)}
            to="/docs/intro">
            <Translate id="homepage.button.getStarted">快速开始</Translate>
            <span className={styles.arrow}>→</span>
          </Link>
          <Link
            className={clsx('button', styles.secondaryButton)}
            to="https://github.com">
            GitHub
          </Link>
        </div>

        {/* 终端命令行演示卡片 */}
        <div className={styles.terminalCard}>
          <div className={styles.terminalHeader}>
            <span className={clsx(styles.terminalDot, styles.dotRed)}></span>
            <span className={clsx(styles.terminalDot, styles.dotYellow)}></span>
            <span className={clsx(styles.terminalDot, styles.dotGreen)}></span>
            <span className={styles.terminalTitle}>bash</span>
          </div>
          <div className={styles.terminalBody}>
            <code>
              <span className={styles.commandPrompt}>$</span> npm install your-project
            </code>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ title, icon, description }) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className={styles.card}>
        <div className={styles.cardIcon}>{icon}</div>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main className={styles.mainSection}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <FeatureCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
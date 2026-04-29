import DashboardMainLayout from '../dashboard/components/DashboardMainLayout';
import MyCourses from '../dashboard/components/MyCourses';

/**
 * AI课程制作页面：展示我的课程列表
 * 新建课程入口在「我的课程」标题栏按钮
 */
const AiCoursePage = () => {
  return (
    <DashboardMainLayout
      breadcrumb={
        <>
          <span className="text-gray-700 font-semibold">AI课程制作</span>
        </>
      }
    >
      <div className="px-6 py-5 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">早上好，刘楚涵 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">今天是 2026年3月27日，让我们开始高效制课吧！</p>
        </div>

        <MyCourses />
      </div>
    </DashboardMainLayout>
  );
};

export default AiCoursePage;

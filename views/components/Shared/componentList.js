import Announcements from '../Announcements/Container';
import Multimedia from '../Multimedia/Container';
import Forum from '../Forum/Container';

const componentList = {
  announcements: {
    container: Announcements,
    icon: 'announcement'
  },
  multimedia: {
    container: Multimedia,
    icon: 'video_library'
  },
  forum: {
    container: Forum,
    icon: 'forum'
  }
};

export default componentList;

import Announcements from '../Announcements/Container';
import Multimedia from '../Multimedia/Container';

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
    container: Announcements,
    icon: 'forum'
  }
};

export default componentList;

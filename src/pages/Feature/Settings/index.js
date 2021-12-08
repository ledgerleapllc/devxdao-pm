import { Card, CardHeader, CardBody, Button, useSnackBar } from '@shared/partials';
import { ChangePasswordDialog } from './components/dialogs/ChangePasswordDialog';
import { useDialog } from '../../../shared/partials/dialog/Provider';

const Settings = () => {
  const { openDialog } = useDialog();
  const { openSnack } = useSnackBar();

  const openChangePWDialog = () => {
    openDialog(
      <ChangePasswordDialog afterClosed={(result) => forceReload(result)} />
    );
  }

  const forceReload = (result) => {
    if (result) {
      openSnack('primary', 'Your password has successfully been updated!');
    }
  }

  return (
    <Card className="h-full flex-1 min-h-0">
      <CardHeader>
        <div className="w-full flex justify-between">
          <h2>Settings</h2>
        </div>
      </CardHeader>
      <CardBody>
        <div data-aos="fade-up" data-aos-duration="800">
          <h6 className="pb-4">Update Password</h6>
          <Button size="sm" className="!w-1" color="primary" onClick={() => openChangePWDialog()}>Start</Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default Settings;
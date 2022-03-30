import { Button } from "@shared/partials";
import { useState } from "react";
import { Dialog } from "@shared/partials/dialog/Provider";
import { useDispatch } from "react-redux";
import { submitReview } from '@stores/api/pa/actions';

export const ConfirmSubmitReviewDialog = ({ data, className, close, color = 'primary' }) => {
  const props = {
    className,
  };
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();

  const submit = () => {
    setLoading(true);
    dispatch(
      submitReview(
        data,
        (res) => {
          setLoading(false);
          close(res);
        },
        () => {
          setLoading(false);
          close();
        }
      )
    );
  }

  return (
    <Dialog {...props}>
      <Dialog.Header>
        <h3 className="text-lg text-primary">Submit Milestone Review</h3>
      </Dialog.Header>
      <Dialog.Body>
        <p className="text-sm text-center">
          Are you sure you are ready to submit your review?
        </p>
      </Dialog.Body>
      <Dialog.Footer>
        <div className="mt-8">
          <Button 
            type="submit"
            onClick={submit}
            isLoading={loading}
            className="mx-auto block !w-3/5 mb-2.5 px-6"
            color={color}
            disabled={loading}>
              Submit Review
          </Button>
          <button type="button" className="mx-auto block text-xs underline" onClick={() => close(false)}>Cancel & Go Back</button>
        </div>
      </Dialog.Footer>
    </Dialog>
  )
};

import { Card, CardHeader, CardBody, BreadCrumb, Select, Checkbox, CheckboxX, Button, useDialog, CardBodyPreview, CardBodyExpand, useSnackBar } from '@shared/partials';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobDetailForAdmin, getPAs, assignPA, unassignPA } from '@stores/api/admin/actions';
import { getJobDetailForUser } from '@stores/api/pa/actions';
import { updateNotes } from '@stores/api/pa/actions';
import { useParams, useLocation } from "react-router-dom";
import { formatPrice, formatDate, getLicenses } from '@shared/core/utils';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ConfirmSubmitReviewDialog } from './components/dialogs/ConfirmSubmitReviewDialog';
import { ReactComponent as IconCheckSquare } from '@assets/icons/ic-check-square.svg';
import { GRANTTYPES, RELATIONSHIPS } from '@shared/core/constant';
import { AppContext } from '../../../App';

const VALID_RESPONSE_SELECT = [
  {
    label: 'Pass',
    value: 'Pass'
  },
  {
    label: 'Pass with notes',
    value: 'Pass with notes'
  },
  {
    label: 'Failure',
    value: 'Failure'
  },
  {
    label: 'Auto-Failure',
    value: 'Auto-Failure'
  }
]

const MemberDetail = ({ member, index }) => {
  return (
    <div className="flex flex-col gap-9">
      <h6>Team Member #{index + 1}</h6>
      <div>
        <h6 className="pb-2.5">Full Name</h6>
        <p className="text-gray1">{member?.full_name}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Education/Experience</h6>
        <p className="text-gray1">{member?.bio}</p>
      </div>
    </div>
  )
};

const GrantDetail = ({ member, index }) => {
  return (
    <div className="flex gap-5" key={`grant_${index}`}>
      <IconCheckSquare className="text-primary"/>
      <div>
        <label className="font-medium">
          {GRANTTYPES[0]}
        </label>
        <p>
          Percentage kept by OP: 123123
        </p>
      </div>
      <span>
        {formatPrice('3000')}
      </span>
    </div>
  )
};

const CitationDetail = ({ citation, index }) => {
  return (
    <div className="flex flex-col gap-9">
      <h6>Citation #{index + 1}</h6>
      <div>
        <h6 className="pb-2.5">Cited Proposal Number</h6>
        <p className="text-gray1">{citation?.rep_proposal_id}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Cited Proposal Title</h6>
        <p className="text-gray1">{citation?.rep_proposal?.title}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Cited Proposal OP</h6>
        <p className="text-gray1">{citation?.rep_proposal?.user?.first_name} {citation?.rep_proposal?.user?.last_name}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Explain how this work is foundational to your work</h6>
        <p className="text-gray1">{citation?.explanation}</p>
      </div>
      <div>
        <h6 className="pb-2.5">% of the rep gained from this proposal do you wish to give to the OP of the prior work</h6>
        <p className="text-gray1">{citation?.percentage}</p>
      </div>
    </div>
  )
};

const MilestoneDetail = ({ mile, index }) => {
  return (
    <div className="flex flex-col gap-9">
      <h6>Milestone #{index + 1}</h6>
      <div>
        <h6 className="pb-2.5">Title of Milestone (10 word limit)</h6>
        <p className="text-gray1">{mile?.title}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Details of what will be delivered in milestone</h6>
        <p className="text-gray1">{mile?.details}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Acceptance criteria: Please enter the specific details on what the deliverable must do to prove this milestone is complete.</h6>
        <p className="text-gray1">{mile?.criteria}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Grant portion requested for this milestone</h6>
        <p className="text-gray1">{mile?.grant}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Deadline</h6>
        <p className="text-gray1">{formatDate(new Date(mile?.deadline))}</p>
      </div>
      <div>
        <h6 className="pb-2.5">Level of Difficulty</h6>
        <p className="text-gray1">{mile?.level_difficulty}</p>
      </div>
    </div>
  )
};

const ControllerCheckbox = ({ control, field, text, job }) => {
  return (
    <Controller
      control={control}
      name={field}
      render={({
        field: { onChange, value },
      }) => (
        <Checkbox 
          onChange={onChange}
          value={value}
          text={text}
          readOnly
        >
          <p className="text-xs text-gray2">{formatDate(job?.submitted_time)}</p>
        </Checkbox>
      )}
    />
  )
}

const ControllerCheckboxAndNotes = ({ id, setValue, watch, control, job, register, fieldCheck, fieldNotes, text, textarea, disabled }) => {
  const [show, setShow] = useState();
  const [oldValue, setOldValue] = useState();
  const dispatch = useDispatch();
  const watchChange = watch(fieldNotes);

  const save = () => {
    setShow(false);
    dispatch(updateNotes(
      id,
      { [fieldNotes]: watchChange },
      () => {},
      () => {}
    ))
  };

  const handleTool = () => {
    setOldValue(watchChange);
    setShow(true);
  }

  const cancel = () => {
    setValue(fieldNotes, oldValue);
    setShow(false);
  }

  return (
    <Controller
      control={control}
      name={fieldCheck}
      render={({
        field: { onChange, value },
      }) => (
        <CheckboxX 
          onChange={onChange}
          value={value}
          text={text}
          readOnly={disabled}
        > 
          {
            textarea
            ? <textarea 
                placeholder="Please Submit Notes"  
                {...register(fieldNotes)}
                onFocus={() => handleTool()}
                rows="3"
                disabled={disabled}
                className="border border-gray3 w-full my-1.5 p-3"
              />
            : <input
                placeholder="Notes" 
                {...register(fieldNotes)}
                disabled={disabled}
                onFocus={() => handleTool()}
                className="border border-gray3 h-9 w-full my-1.5 px-3"
              />
          }
          <div className="flex justify-between">
            <p className="text-xs text-gray2">{formatDate(job?.submitted_time)}</p>
            {show && (
              <div data-aos="fade-in" data-aos-duration="100" className="flex gap-1">
                <Button className="!px-0" color="primary" size="xs" onClick={save}>Save</Button>
                <Button className="!px-0"color="default" size="xs"  onClick={() => cancel()}>Cancel</Button>
              </div>
            )}
          </div>
        </CheckboxX>
      )}
    />
  )
}

const ControllerDropdownAndNotes = ({ id, setValue, watch, control, job, register, fieldCheck, fieldNotes, text, textarea, disabled }) => {
  const [show, setShow] = useState();
  const [oldValue, setOldValue] = useState();
  const dispatch = useDispatch();
  const watchChange = watch(fieldNotes);

  const save = () => {
    setShow(false);
    dispatch(updateNotes(
      id,
      { [fieldNotes]: watchChange },
      () => {},
      () => {}
    ))
  };

  const handleTool = () => {
    setOldValue(watchChange);
    setShow(true);
  }

  const cancel = () => {
    setValue(fieldNotes, oldValue);
    setShow(false);
  }

  return (
    <Controller
      control={control}
      name={fieldCheck}
      render={({
        field: { onChange, value },
      }) => (
        <div className="pl-7">
          <label>{text}</label>
          <Select placeholder="Select..." options={VALID_RESPONSE_SELECT} value={value} onChange={onChange} />
          <input
            placeholder="Notes" 
            {...register(fieldNotes)}
            disabled={disabled}
            onFocus={() => handleTool()}
            className="border border-gray3 h-9 w-full my-1.5 px-3"
          />
          <div className="flex justify-between">
            <p className="text-xs text-gray2">{formatDate(job?.submitted_time)}</p>
            {show && (
              <div data-aos="fade-in" data-aos-duration="100" className="flex gap-1">
                <Button className="!px-0" color="primary" size="xs" onClick={save}>Save</Button>
                <Button className="!px-0"color="default" size="xs"  onClick={() => cancel()}>Cancel</Button>
              </div>
            )}
          </div>
        </div>
      )}
    />
  )
}

const schema = yup.object().shape({
  appl_accepted_definition: yup.bool().oneOf([true], 'Field must be checked'),
  appl_accepted_pm: yup.bool().oneOf([true], 'Field must be checked'),
  appl_attests_accounting: yup.bool().oneOf([true], 'Field must be checked'),
  appl_attests_criteria: yup.bool().oneOf([true], 'Field must be checked'),
  appl_submitted_corprus: yup.bool().oneOf([true], 'Field must be checked'),
  appl_accepted_corprus: yup.bool().oneOf([true], 'Field must be checked'),
  // PM
  pm_submitted_admin_notes: yup.string().required(''),
  pm_submitted_evidence: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  pm_submitted_admin: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  pm_verified_corprus: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  pm_verified_crdao: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  pm_verified_subs: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  //CR
  crdao_acknowledged_project: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  crdao_accepted_pm: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  crdao_acknowledged_receipt: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  crdao_submitted_review: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  crdao_submitted_subs: yup.number().required().oneOf([1, 0], 'Field must be checked'),
  crdao_valid_respone: yup.string().required('Field must be choose')
});

const JobsDetail = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const location = useLocation();
  const [job, setJob] = useState();
  const [pas, setPAs] = useState();
  const [dateAssign, setDateAssign] = useState();
  const user = useSelector(state => state.authReducer?.user);
  const { openDialog } = useDialog();
  const { setLoading } = useContext(AppContext);
  const { openSnack } = useSnackBar();
  const [ disabled, setDisabled ] = useState();

  const {
    reset,
    register,
    handleSubmit,
    control,
    setValue,
    formState,
    watch,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const fullData = watch();

  useEffect(() => {
    document.body.classList.add('scroll-window');
    setLoading(true);
    const fetchJob = user.is_super_admin ? getJobDetailForAdmin : getJobDetailForUser;
    dispatch(
      fetchJob(
        { id },
        (res, previousChecklist) => {
          setLoading(false);
          setJob(res);
          if (!res.milestone_check_list) {
            if (previousChecklist) {
              reset(previousChecklist);
            } else {
              reset({
                appl_accepted_definition: true,
                appl_accepted_pm: true,
                appl_attests_accounting: true,
                appl_attests_criteria: true,
                appl_submitted_corprus: true,
                appl_accepted_corprus: true,
              });
            }
          } else {
            reset({
              ...res.milestone_check_list,
              appl_accepted_definition: true,
              appl_accepted_pm: true,
              appl_attests_accounting: true,
              appl_attests_criteria: true,
              appl_submitted_corprus: true,
              appl_accepted_corprus: true,
            });
          }
          setDateAssign(res.assigned_at || '');
          dispatch(
            getPAs(
              {},
              (resPA) => {
                if (res.assigner_id) {
                  const unassign = { label: 'Unassigned', value: null };
                  setPAs([unassign, ...resPA]);
                } else {
                  setPAs([...resPA]);
                }
              }, 
              () => {
              }
            )
          );
        }, 
        () => {
        }
      )
    );
    return () => {
      document.body.classList.remove('scroll-window');
    }
  }, []);

  const assign = (val) => {
    if (val) {
      dispatch(
        assignPA({id, user_id: val },
          () => {
            setDateAssign(new Date());
            if (pas.filter(x => x.label === 'Unassigned').length === 0) {
              const unassign = { label: 'Unassigned', value: null };
              setPAs([unassign, ...pas]);
            }
            job.assigner_id = val;
            job.milestone_review_status = 'active';
            setJob({ ...job });
          },
          () => {
          }
        )
      );
    } else {
      dispatch(
        unassignPA({ id },
          () => {
            setDateAssign(null);
          },
          () => {
          }
        )
      );
    }  
  }

  console.log(fullData, formState.isValid);

  const getColor = () => {
    if (!formState.isValid) {
      return 'default';
    }

    const indx = Object.keys(fullData).find(x => fullData[x] === 0 || fullData[x] === '0' || fullData[x] === false);
    if (indx) {
      return 'danger';
    } else {
      return 'success';
    }
  }

  const renderMilestoneStep = () => {
    const index = job?.milestones.findIndex(x => +x.id === +job?.milestone_id);
    return `${index + 1}/${job?.milestones.length}`;
  }

  const renderMilestoneTimeSubmit = () => {
    const mile = job?.milestones.find(x => x.id === job?.milestone_id);
    return mile?.time_submit;
  }

  const submit = (data) => {
    const params = { ...data, id };
    const fields = [
      'crdao_acknowledged_receipt',
      'crdao_submitted_subs',
      'pm_submitted_admin',
      'pm_submitted_evidence',
      'pm_verified_corprus',
      'pm_verified_crdao',
      'pm_verified_subs',
      'crdao_acknowledged_project',
      'crdao_submitted_review',
      'crdao_accepted_pm'
    ];
    fields.forEach(x => {
      params[x] = !!params[x] ? 1 : 0;
    });
    openDialog(
      <ConfirmSubmitReviewDialog 
        data={params}
        color={getColor()}
        afterClosed={(result) => {
          if (result) {
            openSnack('primary', 'Submit successfully!');
            job.milestone_review_status = result.milestone_review?.status;
            job.reviewed_at = result.milestone_review?.reviewed_at;
            const temp = pas.find(x => +x.value === +result.milestone_review.assigner_id);
            job.assigner_email = temp?.label;
            setJob({ ...job });
            setDisabled(true);
          }
        }} 
      />
    );
  }

  const renderAssignee = () => {
    if (!!user.is_super_admin && ["pending", "active"].includes(job?.milestone_review_status)) {
      return (
        <Select placeholder="Select..." options={pas} value={job?.assigner_id} onChange={assign} />
      );
    } else {
      return (
        <p className="text-lg text-secondary">{job?.assigner_email}</p>
      )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <BreadCrumb url={location.pathname.startsWith('/app/assign') ? '/app/assign' : '/app/job-board'} />
      <div className="flex-1 min-h-0 flex gap-5">
        <div className="flex flex-col gap-5 !w-7/10">
          <Card className="!py-9" expand>
            <CardHeader>
              <div className="flex justify-between">
                <h2>Milestone Details for Review</h2>
              </div>
            </CardHeader>
            <CardBody scrollable>
              <CardBodyPreview className="flex flex-col gap-9">
                <div>
                  <h6 className="pb-2.5">Milestone Title</h6>
                  <p className="text-gray1">{job?.title} - Submission {job?.time_submit}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Show acceptance criteria</h6>
                  <p className="text-gray1">{job?.criteria}</p>
                </div>
              </CardBodyPreview>
              <CardBodyExpand className="flex flex-col gap-9" expandClass="pt-9">
                <div>
                  <h6 className="pb-2.5">Milestone Status</h6>
                  <p className="text-gray1">{job?.submitted_time ? 'Submitted' : "Not Submit"}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Paid</h6>
                  <p className="text-gray1">{job?.paid ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">OP Milestone Submission URL</h6>
                  <p className="text-gray1">{job?.milestone_submit_history?.url}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">OP Milestone Submission Notes</h6>
                  <p className="text-gray1 whitespace-pre-wrap">{job?.milestone_submit_history?.comment}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Grant Portion</h6>
                  <p className="text-gray1">{formatPrice(job?.grant)}</p>
                </div>
              </CardBodyExpand>
            </CardBody>
          </Card>
          <Card className="!py-9" expand expandClass="flex-1 min-h-0">
            <CardHeader>
              <div className="flex justify-between">
                <h2>Proposal Details for Review</h2>
              </div>
            </CardHeader>
            <CardBody scrollable>
              <CardBodyPreview className="flex flex-col gap-9">
                <div>
                  <h6 className="pb-2.5">Title of proposed project</h6>
                  <p className="text-gray1">{job?.proposal?.title}</p>
                </div>
              </CardBodyPreview>
              <CardBodyExpand className="flex flex-col gap-9" expandClass="pt-9">
                <div>
                  <h6 className="pb-2.5">Describe your project in detail. Please include what it does and what problem it solves</h6>
                  <p className="text-gray1">{job?.proposal?.short_description}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Explanation as to how your proposed project would benefit the DEVxDAO ecosystem AND/OR support transparent and open source scientific research and/ or development if applicable</h6>
                  <p className="text-gray1">{job?.proposal?.explanation_benefit}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Under which open source license(s) will you publish any research and development associated with your proposed Project? All research papers or the like should be Creative Commons.</h6>
                  <p className="text-gray1">{getLicenses(job?.proposal?.license, job?.proposal?.license_other)}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Your resume (Linkedin) or Git (For developers)</h6>
                  <p className="text-gray1">{job?.proposal?.resume}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Notes or reference about the project, such as similar projects or web pages about APIs to be integrated with your build</h6>
                  <p className="text-gray1">{job?.proposal?.extra_notes}</p>
                </div>
                <h6 className="pb-2.5 text-primary">Team Details</h6>
                {job?.proposal?.members.length === 0 && <p className="text-gray1">I am working on this project alone.</p>}
                {job?.proposal?.members.length > 0 && job?.proposal?.members?.map((member, index) => (
                  <MemberDetail member={member} index={index} />
                ))}
                <h6 className="pb-2.5 text-primary">Grants Details</h6>
                <div>
                  <h6 className="pb-2.5">Please enter the total amount you are requesting as a grant</h6>
                  <p className="text-gray1">{formatPrice(job?.proposal?.total_grant)}</p>
                </div>
                <div>
                  <h6 className="pb-2.5">Will payments for this work be made to a entity such as your company or organization instead of to you personally?</h6>
                  <p className="text-gray1">
                    {job?.proposal?.is_company_or_organization? `Yes (${job?.proposal.name_entity} - ${job?.proposal.entity_country})` : "No"}
                  </p>
                </div>
                <div>
                  <h6 className="pb-2.5">Please select all planned uses for your grant funds. Select all that apply and enter the estimated portion of grant funds allocated for each. All totals must equal the upper amount</h6>
                  {[1].map((member, index) => (
                    <GrantDetail />
                  ))}
                </div>
                <div>
                  <h6 className="pb-2.5">Did a Voting Associate of the DEVxDAO assist you during the grant application process as a mentor?</h6>
                  <p className="text-gray1">
                    {
                      job?.proposal?.have_mentor
                        ? `Yes (${job?.proposal?.name_mentor} - ${job?.proposal?.total_hours_mentor})`
                        : "No"
                    }
                  </p>
                </div>
                <h6 className="text-primary">
                  Milestone Details
                  <p className="pb-2.5 text-gray1">
                    Projects are typically divided into milestones. Please propose the milestones in which the total project will be delivered:
                  </p>
                </h6>
                {job?.milestones?.map((mile, index) => (
                  <MilestoneDetail mile={mile} index={index} />
                ))}
                <h6 className="pb-2.5 text-primary">Relationships and previous work</h6>
                <div>
                  <h6 className="pb-2.5">Please outline your relationship with ETA and Contributors of ETA</h6>
                  {
                    job?.proposal?.relationship.split(',').sort().map((relation, index) => (
                      <div className="flex gap-5 py-2" key={`relation_${index}`}>
                        <IconCheckSquare color="#9B64E6" />
                        <label className="font-weight-700">{RELATIONSHIPS[relation]}</label>
                      </div>
                    ))
                  }
                </div>
                <div>
                  <h6 className="pb-2.5">Have you ever received a Grant under this program before?</h6>
                  <p className="text-gray1">
                    {job?.proposal?.received_grant_before ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h6 className="pb-2.5">If the answer to the previous question is YES, have you entirely fulfilled your contractual obligations?</h6>
                  <p className="text-gray1">
                    {job?.proposal?.has_fulfilled ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h6 className="pb-2.5">Are you aware that you or another person received a Grant under this Program for a Project which is foundational to your proposed Project?</h6>
                  <p className="text-gray1">
                    {job?.proposal?.received_grant ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h6 className="pb-2.5">If the answer to the prior question is yes, please cite any previous work performed under this Program, which is foundational to your proposed Project</h6>
                  <p className="text-gray1">
                    {job?.proposal?.foundational_work}
                  </p>
                </div>
                <h6 className="pb-2.5 text-primary">Citations</h6>
                <div>
                  {job?.proposal.citations?.map((citation, index) => (
                    <CitationDetail citation={citation} index={index} />
                  ))}
                </div>
                <h6 className="pb-2.5 text-primary">Tags</h6>
                <div className="flex gap-2">
                  {job?.proposal?.tags?.split(',').map(tag => (
                    <div className="bg-primary px-4 py-2 text-white rounded-full">{tag}</div>
                  ))}
                </div>
                <h6 className="pb-2.5 text-primary">Uploaded Files</h6>
                <ul>
                  {job?.proposal?.files?.map((file, index) => (
                    <li key={index}>
                      <a
                          href={`${process.env.REACT_APP_BASE_URL}${file.url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {file.name}
                        </a>
                    </li>
                  ))}
                </ul>
              </CardBodyExpand>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col flex-1 gap-5">
          <Card className="h-m-content !py-9">
            <CardBody>
              <div className="flex pb-6 border-b border-gray3">
                <div className="w-1/2 pr-4">
                  <label className="text-gray2 text-sm">OP Email</label>
                  <p className="break-words text-base text-primary font-medium">{job?.email}</p>
                </div>
                <div className="w-1/2">
                  <label className="text-gray2 text-sm">Times Submitted</label>
                  <p className="text-base text-primary font-medium">{renderMilestoneTimeSubmit()}</p>
                </div>
              </div>
              <div className="flex py-6 border-b border-gray3">
                <div className="w-1/2 pr-4">
                  <label className="text-gray2 text-sm">Proposal Status</label>
                  <p className="text-base text-primary font-medium capitalize">{job?.proposal_status}</p>
                </div>
                <div className="w-1/2">
                  <label className="text-gray2 text-sm">Proposal Number</label>
                  <p className="text-base text-primary font-medium">{job?.proposal_id}</p>
                </div>
              </div>
              <div className="flex pt-6">
                <div className="w-1/2 pr-4">
                  <label className="text-gray2 text-sm">Milestone</label>
                  <p className="text-base text-primary font-medium">{renderMilestoneStep()}</p>
                </div>
                <div className="w-1/2">
                  <label className="text-gray2 text-sm">Completed</label>
                  <p className="text-base text-primary font-medium">{job?.reviewed_at ? formatDate(job?.reviewed_at) : '-'}</p>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className="h-m-content !py-9">
            <CardBody>
              <div className="">
                <label className="text-gray2 text-sm">Assignee</label>
                {renderAssignee()}
                <p className="text-primary">{formatDate(dateAssign)}</p>
              </div>
            </CardBody>
          </Card>
          <form onSubmit={handleSubmit(submit)}>
            <Card className="h-m-content !py-9">
              <CardBody>
                <div className="">
                  <label className="text-gray2 text-sm">Review Checklist</label>
                  <div className="pb-6 flex flex-col gap-6">
                    <h6 className="text-primary text-lg">Applicant Checklist</h6>
                    <ControllerCheckbox control={control} field="appl_accepted_definition" text="Applicant has accepted the Definition of Done?" />
                    <ControllerCheckbox control={control} field="appl_accepted_pm" text="Applicant has accepted Program Management T&C?" />
                    <ControllerCheckbox control={control} field="appl_attests_accounting" text="Applicant attests that the work represents a full accounting of the deliverables in the milestone?" />
                    <ControllerCheckbox control={control} field="appl_attests_criteria" text="Applicant attests that the work adheres to the acceptance criteria as per the Definition of Done?" />
                    <ControllerCheckbox control={control} field="appl_submitted_corprus" text="Applicant has submitted a corpus of work?" />
                    <ControllerCheckbox control={control} field="appl_accepted_corprus" text="Applicant has accepted the Expert Dao (CR Dao) review of their corpus?" />
                  </div>
                  <div className="py-6 flex flex-col gap-6 border-t border-gray3">
                    <h6 className="text-primary text-lg">CR Dao Checklist</h6>
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register}
                      fieldCheck="crdao_acknowledged_project"
                      fieldNotes="crdao_acknowledged_project_notes"
                      text="Expert Dao (CR Dao) has acknowledged the project Definition of Done?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="crdao_accepted_pm"
                      fieldNotes="crdao_accepted_pm_notes"
                      text="Expert Dao (CR Dao) has accepted the Program Management T&C?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="crdao_acknowledged_receipt"
                      fieldNotes="crdao_acknowledged_receipt_notes"
                      text="Expert Dao (CR Dao) has acknowledged receipt of the corpus of work?"
                      disabled={disabled}
                    />
                    <ControllerDropdownAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="crdao_valid_respone"
                      fieldNotes="crdao_valid_respone_note"
                      text="Program management has valid response from Expert Dao?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="crdao_submitted_review"
                      fieldNotes="crdao_submitted_review_notes"
                      text="Expert Dao (CR Dao) has submitted a review of the corpus of work?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="crdao_submitted_subs"
                      fieldNotes="crdao_submitted_subs_notes"
                      text="Expert Dao (CR Dao) has submitted a substantiation of the review via voting record?"
                      disabled={disabled}
                    />
                  </div>
                  <div className="py-6 flex flex-col gap-6 border-t border-gray3">
                    <h6 className="text-primary text-lg">Program Management Checklist</h6>
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="pm_submitted_evidence"
                      fieldNotes="pm_submitted_evidence_notes"
                      text="Program Management has submitted the Evidence of Work location?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="pm_submitted_admin"
                      fieldNotes="pm_submitted_admin_notes"
                      text="Program Management has submitted Administrator notes?"
                      textarea
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="pm_verified_corprus"
                      fieldNotes="pm_verified_corprus_notes"
                      text="Program Management has verified corpus existence?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="pm_verified_crdao"
                      fieldNotes="pm_verified_crdao_notes"
                      text="Program Management has verified Expert Dao (CR Dao)’s review exists?"
                      disabled={disabled}
                    />
                    <ControllerCheckboxAndNotes
                      setValue={setValue}
                      id={id}
                      control={control}
                      job={job}
                      watch={watch}
                      register={register} 
                      fieldCheck="pm_verified_subs"
                      fieldNotes="pm_verified_subs_notes"
                      text="Program Management has verified Expert Dao (CR Dao) substantiation (voting record) existence?"
                      disabled={disabled}
                    />
                    <div>
                      <p className="text-sm">Please provide any additional notes in the field below. These will be publicly visible in the DxD portal.</p>
                      <input 
                        {...register('addition_note')} 
                        placeholder="Optional Notes"
                        className="border border-gray3 h-9 w-full my-1.5 px-3"
                        disabled={disabled}
                      />
                      <p className="text-xs text-gray2">{formatDate(job?.submitted_time)}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            {job?.milestone_review_status === "active" && (
              <Button
                type="submit"
                className="ml-auto block !w-3/5 mt-5 mb-2.5 px-6" 
                color={getColor()}
                disabled={!formState.isValid} 
              >
                Submit Review
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobsDetail;
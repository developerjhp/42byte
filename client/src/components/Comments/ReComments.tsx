import React from 'react';
import { useState } from 'react';
import { useQuery,  useQueryClient, useMutation } from 'react-query';
import instance from 'utils/functions/axios';
import DropdownMenu from 'components/DropdownMenu/DropdownMenu';
import CommentInput from 'components/CommentInput/CommentInput';
import { RecommentData } from 'utils/functions/type';
import { timeForToday, isDelOption } from 'utils/functions/functions';
import { GrLike } from "react-icons/gr";
import { Container, RecommentContainer, ReCommentWrap, ModifyCommentWrap, CommentTop, Info, Modify, Content, 
				LikesBox, GLine, FLine } from './styled'

type GreetingProps = {
	recomment: RecommentData
}

function ReComments({recomment}: GreetingProps) {
	const {authorId, blameCnt, content, createdDate, id, isAuthor, isDel, isLiked, isUsers, likeCnt, modifiedDate, recomments, rootCommentId, targetAuthorId } = recomment;

	const [openEditor, setOpenEditor] = useState<boolean>(false);
	const [boxState, setBoxState] = useState<boolean>(isLiked);
	const queryClient = useQueryClient();
	const mutationPost = useMutation(
		({ path, data }: { path: string; data?: object }) => instance.post(path, data));
	const mutationDelete = useMutation(
		({ path }: { path: string; }) => instance.delete(path));
	const mutationPut = useMutation(
		({ path, data }: { path: string; data?: object }) => instance.put(path, data));

	const modifyCmtHandler = () => {
		setOpenEditor(!openEditor);
	}
	const updateCmtHandler = (comment: string) => {
		mutationPut.mutate({path: `/comment?commentId=${id}`, data: {content: comment}},
		{ onSuccess: (data) => {
				queryClient.invalidateQueries(['detail_key']);
				setOpenEditor(!openEditor);},
			onError: (data) => {window.location.href = '/error';}
		})
	}

	const deleteCmtHandler = () => {
		mutationDelete.mutate({path: `/comment?commentId=${id}`},
		{ onSuccess: (data) => {
				queryClient.invalidateQueries(['detail_key']);},
			onError: (data) => {window.location.href = '/error';}
		});
	}

	const reportHandler = (reportIssue: string) => {
		if (reportIssue) {
			instance
			.post(`/comment/blame?commentId=${id}`, { issue: reportIssue })
			.then(() => {})
			.catch((err) => { console.log(err) });
		}
	}

	// const boxcolorHandler = () => {
	// 	mutationPost.mutate({path: `/comment/like?postId=${postId}&commentId=${id}`, data: undefined},
	// 	{ onSuccess: (data) => {
	// 			queryClient.invalidateQueries(['detail_key']);
	// 			setBoxState(!boxState);},
	// 		onError: (data) => {window.location.href = '/error';}
	// 	});
	// }

	return (
		<>
		<Container>
			<GLine/>
			<FLine/>
			
			<RecommentContainer>
			<div>&#8627;</div>
				{openEditor
				? <ModifyCommentWrap>
						<CommentTop>
							<Info>
							<h3>카뎃</h3>
								{/* {isAuthor ? <h3>작성자</h3>
									: isUsers ? <h3><u>카뎃 {commentsUserList.indexOf(authorId)+1}</u></h3>
									: <h3>카뎃 {commentsUserList.indexOf(authorId)+1}</h3>
									} */}
							</Info>
							<Modify>
								<div onClick={modifyCmtHandler}>취소</div>
							</Modify>
						</CommentTop>
						<Content>
							<CommentInput submitCmtHandler={updateCmtHandler} defaultContent={content} />
						</Content>
					</ModifyCommentWrap>
				: <ReCommentWrap>
						<CommentTop>
							<Info>
							<h3>카뎃</h3>
								{/* {isAuthor ? <h3>작성자</h3>
									: isUsers ? <h3><u>카뎃 {commentsUserList.indexOf(authorId)+1}</u></h3>
									: <h3>카뎃 {commentsUserList.indexOf(authorId)+1}</h3>} */}
								<div>{timeForToday(createdDate)} {(createdDate !== modifiedDate) && '수정됨'}</div>
							</Info>
							{!isDel && <DropdownMenu isUsers={isUsers} modifyHandler={modifyCmtHandler} deleteHandler={deleteCmtHandler} reportHandler={reportHandler} />}
						</CommentTop>
						<Content>
							{isDel
							? <div className='isDel'>&#9986; {isDelOption(isDel)}에 의해 삭제된 댓글 입니다.</div> 
							: <div>{content}</div>}
						</Content>
						{/* <LikesBox boxState={boxState} onClick={boxcolorHandler}>
							<div><GrLike /></div>
							<div>{likeCnt}</div>
						</LikesBox> */}
				</ReCommentWrap>}
			</RecommentContainer>
			</Container>
		</>
	);
}

export default ReComments
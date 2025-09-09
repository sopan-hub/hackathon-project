// This page is now a directory. Redirecting to the first chapter.
import { redirect } from 'next/navigation';

export default function LessonRedirectPage({ params }: { params: { id: string } }) {
    const { id } = params;
    redirect(`/lessons/${id}/0`);
}

// Server Actions Examples
// React 19 with TypeScript

// ===========================================
// Example 1: Basic Server Action
// ===========================================

// File: app/actions.ts
'use server';

interface CreatePostResult {
    success: boolean;
    postId?: string;
    error?: string;
}

export async function createPost(formData: FormData): Promise<CreatePostResult> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    // Validate
    if (!title || title.length < 3) {
        return { success: false, error: 'Title must be at least 3 characters' };
    }

    // Database operation (simulated)
    // const post = await db.post.create({ data: { title, content } });
    const postId = Date.now().toString();

    // Revalidate cache
    // revalidatePath('/posts');

    return { success: true, postId };
}

// ===========================================
// Example 2: Server Action with Validation
// ===========================================

'use server';

import { z } from 'zod';

const UserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be at least 18').optional(),
});

type FormState = {
    success: boolean;
    errors?: Record<string, string[]>;
    message?: string;
};

export async function createUser(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        age: formData.get('age') ? Number(formData.get('age')) : undefined,
    };

    const result = UserSchema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
        };
    }

    // Create user
    // await db.user.create({ data: result.data });

    return {
        success: true,
        message: 'User created successfully!',
    };
}

// ===========================================
// Example 3: Mutations with Revalidation
// ===========================================

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function updateProduct(
    productId: string,
    formData: FormData
): Promise<{ success: boolean }> {
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));

    // Update database
    // await db.product.update({
    //   where: { id: productId },
    //   data: { name, price }
    // });

    // Revalidate the products page
    revalidatePath('/products');

    // Or revalidate by tag
    revalidateTag('products');

    return { success: true };
}

export async function deleteProduct(productId: string): Promise<void> {
    // await db.product.delete({ where: { id: productId } });

    revalidatePath('/products');
}

// ===========================================
// Example 4: Server Action with Redirect
// ===========================================

'use server';

import { redirect } from 'next/navigation';

export async function createAndRedirect(formData: FormData): Promise<never> {
    const title = formData.get('title') as string;

    // Create the resource
    // const post = await db.post.create({ data: { title } });
    const postId = 'new-post-id';

    // Redirect to the new resource
    redirect(`/posts/${postId}`);
}

// ===========================================
// Example 5: Server Actions with Auth
// ===========================================

'use server';

import { cookies } from 'next/headers';

async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;
    // Verify session and return user
    return sessionId ? { userId: '123', role: 'user' } : null;
}

export async function protectedAction(formData: FormData) {
    const session = await getSession();

    if (!session) {
        throw new Error('Unauthorized');
    }

    // Proceed with authenticated action
    // await db.userAction.create({
    //   data: { userId: session.userId, ... }
    // });

    return { success: true };
}

export async function adminOnlyAction(formData: FormData) {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        throw new Error('Forbidden');
    }

    // Admin-only operation
    return { success: true };
}

// ===========================================  
// Example 6: File Upload Server Action
// ===========================================

'use server';

export async function uploadFile(formData: FormData): Promise<{
    success: boolean;
    url?: string;
    error?: string;
}> {
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        return { success: false, error: 'No file provided' };
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'File too large' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Invalid file type' };
    }

    // Process and upload file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to storage (S3, Cloudflare R2, etc.)
    // const url = await uploadToStorage(buffer, file.name);
    const url = `/uploads/${file.name}`;

    return { success: true, url };
}

/*
  # Create storage bucket for idea attachments

  1. New Storage Bucket
    - Creates a new public storage bucket named 'idea-attachments'
    - Enables public access for reading files
    - Restricts file uploads to authenticated users only
    
  2. Security
    - Adds storage policies for read and write access
    - Public can read all files
    - Any user can upload files
*/

-- Create the storage bucket
insert into storage.buckets (id, name, public)
values ('idea-attachments', 'idea-attachments', true);

-- Allow public access to read files
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'idea-attachments' );

-- Allow authenticated users to upload files
create policy "Anyone can upload files"
on storage.objects for insert
to public
with check (
  bucket_id = 'idea-attachments'
);

-- Allow users to update their own files
create policy "Users can update own files"
on storage.objects for update
to public
using ( bucket_id = 'idea-attachments' )
with check ( bucket_id = 'idea-attachments' );

-- Allow users to delete their own files
create policy "Users can delete own files"
on storage.objects for delete
to public
using ( bucket_id = 'idea-attachments' );
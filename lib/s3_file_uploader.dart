import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;

class S3FileUploader extends StatefulWidget {
  final String backendBaseUrl; // e.g., "http://localhost:5000"

  const S3FileUploader({Key? key, required this.backendBaseUrl}) : super(key: key);

  @override
  _S3FileUploaderState createState() => _S3FileUploaderState();
}

class _S3FileUploaderState extends State<S3FileUploader> {
  PlatformFile? _selectedFile;
  bool _uploading = false;
  double _progress = 0;
  String _statusMessage = '';

  Future<void> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      setState(() {
        _selectedFile = result.files.first;
        _statusMessage = '';
        _progress = 0;
      });
    }
  }

  Future<String?> getSignedUrl(String fileName, String fileType) async {
    final url = Uri.parse('${widget.backendBaseUrl}');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'fileName': fileName, 'fileType': fileType}),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return data['uploadUrl'];
    } else {
      setState(() => _statusMessage = 'Failed to get signed URL');
      return null;
    }
  }

  Future<void> uploadFile(PlatformFile file) async {
    if (file.path == null) return;

    final signedUrl = await getSignedUrl(file.name, 'application/octet-stream');
    if (signedUrl == null) return;

    setState(() {
      _uploading = true;
      _progress = 0;
      _statusMessage = 'Uploading...';
    });

    final totalBytes = File(file.path!).lengthSync();
    int sentBytes = 0;

    final fileStream = File(file.path!).openRead().map((chunk) {
      sentBytes += chunk.length;
      setState(() => _progress = sentBytes / totalBytes);
      return chunk;
    });

    final res = await http.put(
      Uri.parse(signedUrl),
      headers: {'Content-Type': 'application/octet-stream'},
      body: fileStream,
    );

    setState(() {
      _uploading = false;
      _statusMessage = res.statusCode == 200 ? 'Upload complete!' : 'Upload failed!';
      _progress = res.statusCode == 200 ? 1 : 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ElevatedButton(
          onPressed: pickFile,
          child: Text('Select File'),
        ),
        if (_selectedFile != null) ...[
          Text('Selected: ${_selectedFile!.name}'),
          SizedBox(height: 10),
          ElevatedButton(
            onPressed: _uploading ? null : () => uploadFile(_selectedFile!),
            child: Text(_uploading ? 'Uploading...' : 'Upload to S3'),
          ),
          SizedBox(height: 10),
          LinearProgressIndicator(value: _progress),
          SizedBox(height: 10),
          Text(_statusMessage),
        ]
      ],
    );
  }
}

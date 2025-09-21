import 'package:flutter/material.dart';
import 's3_file_uploader.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('S3 File Upload Test')),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: S3FileUploader(
            backendBaseUrl: 'http://localhost:3000/api/s3/upload-url', // replace with your backend URL
          ),
        ),
      ),
    );
  }
}

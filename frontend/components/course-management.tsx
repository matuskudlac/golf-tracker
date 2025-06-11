"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  addCourseToDB,
  deleteCourseFromDB,
  getCoursesAction,
} from "@/app/actions";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: number;
  name: string;
  par: number;
  created_at: string;
  updated_at: string;
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCoursePar, setNewCoursePar] = useState("72");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load courses on component mount using server action
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const result = await getCoursesAction();
        if (result.success && result.data) {
          setCourses(result.data);
        } else {
          toast.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Handle form submission using server action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCourseName.trim()) {
      toast.error("Please enter a course name");
      return;
    }

    const par = Number.parseInt(newCoursePar);
    if (isNaN(par) || par < 60 || par > 80) {
      toast.error("Please enter a valid par value (60-80)");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", newCourseName.trim());
      formData.append("par", par.toString());

      const result = await addCourseToDB(formData);

      if (result.success && result.data) {
        setCourses([...courses, result.data]);
        setNewCourseName("");
        setNewCoursePar("72");
        toast.success("Course added successfully!");
      } else {
        toast.error("Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle course deletion using server action
  const handleDeleteCourse = async (id: number) => {
    try {
      const result = await deleteCourseFromDB(id);

      if (result.success) {
        setCourses(courses.filter((course) => course.id !== id));
        toast.success("Course deleted successfully");
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="pt-3 pb-6 px-6 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Course Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g., Pebble Beach Golf Links"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coursePar">Course Par</Label>
                <Input
                  id="coursePar"
                  type="number"
                  value={newCoursePar}
                  onChange={(e) => setNewCoursePar(e.target.value)}
                  min="60"
                  max="80"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding Course..." : "Add Course"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Course List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No courses added yet. Add your first course!
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Par: {course.par}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {course.name}? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete Course
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

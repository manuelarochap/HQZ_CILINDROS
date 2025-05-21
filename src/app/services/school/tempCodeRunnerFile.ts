
  deleteSchool(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

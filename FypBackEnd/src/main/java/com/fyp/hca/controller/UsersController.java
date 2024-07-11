package com.fyp.hca.controller;

import com.fyp.hca.entity.Users;
import com.fyp.hca.model.PaginatedResponse;
import com.fyp.hca.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UsersController {

    private final UsersService userService;

    @Autowired
    public UsersController(UsersService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/add")
    public void addUsers(@RequestBody Users users) {
        userService.save(users);
    }

    @GetMapping(value = "/get")
    public List<Users> getUsers() {
        return userService.getUsers();
    }

    @GetMapping(value = "/get/{id}")
    public Optional<Users> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @DeleteMapping(value = "/delete/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }

    @PutMapping(value = "/update")
    public void updateUser(@RequestBody Users users) {
        userService.updateUsers(users);
    }

    @GetMapping(value = "/login")
    public Users handleLogin(
            @RequestParam("email") String email,
            @RequestParam("password") String password) {
        return userService.isValidUser(email, password);
    }

    @GetMapping(value = "/getTableData")
    public ResponseEntity<?> getTableData(
            @RequestParam("start") int start,
            @RequestParam("size") int size,
            @RequestParam("filters") String filters,
            @RequestParam("sorting") String sorting,
            @RequestParam("globalFilter") String globalFilter) {
        PaginatedResponse<Users> result = userService.getTableData(start, size, filters, sorting, globalFilter);
        return ResponseEntity.ok().body(result);
    }
}
